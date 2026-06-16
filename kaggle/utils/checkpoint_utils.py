import os
import glob
import tensorflow as tf
from dataset_config import CHECKPOINT_DIR

# ── Find Latest Checkpoint ───────────────────────────────────
def get_latest_checkpoint():
    """
    Scans CHECKPOINT_DIR for .h5 files and returns the path
    of the most recently saved one. Returns None if no
    checkpoints exist yet (fresh training start).
    """
    checkpoints = glob.glob(os.path.join(CHECKPOINT_DIR, '*.h5'))

    if not checkpoints:
        print("No checkpoints found. Training will start fresh.")
        return None

    latest = max(checkpoints, key=os.path.getmtime)
    print(f"Latest checkpoint found: {os.path.basename(latest)}")
    return latest


# ── Load Model From Checkpoint ───────────────────────────────
def load_from_checkpoint(checkpoint_path):
    """
    Loads and returns a full Keras model from a .h5 checkpoint.
    Exits with a clear error if the file is corrupt or missing
    rather than silently failing and training from scratch.
    """
    if not os.path.exists(checkpoint_path):
        raise FileNotFoundError(
            f"Checkpoint not found at: {checkpoint_path}\n"
            "If this is intentional, call build_model() instead."
        )

    print(f"Loading model from checkpoint...")
    model = tf.keras.models.load_model(checkpoint_path)
    print(f"✓ Model loaded successfully from {os.path.basename(checkpoint_path)}")
    return model


# ── Get Callbacks ────────────────────────────────────────────
def get_training_callbacks(phase="initial"):
    """
    Returns the standard set of callbacks for training.
    
    phase: "initial"   → used during frozen base training
           "fine_tune" → used during partial unfreeze training
    
    Callbacks included:
    - ModelCheckpoint : saves best model by val_accuracy
    - CSVLogger       : logs metrics per epoch to a file
    - EarlyStopping   : halts training when val_loss plateaus
    - ReduceLROnPlateau: halves LR when val_loss stops improving
    """
    checkpoint_callback = tf.keras.callbacks.ModelCheckpoint(
        filepath=os.path.join(
            CHECKPOINT_DIR,
            f'{phase}_epoch_{{epoch:02d}}_valacc_{{val_accuracy:.4f}}.h5'
        ),
        monitor='val_accuracy',
        save_best_only=True,
        save_weights_only=False,   # saves full model, not just weights
        verbose=1
    )

    csv_logger = tf.keras.callbacks.CSVLogger(
        os.path.join(CHECKPOINT_DIR, f'{phase}_training_log.csv'),
        append=True                # appends across sessions, never overwrites
    )

    early_stopping = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=7,                # stops if no improvement for 7 epochs
        restore_best_weights=True, # rolls back to best weights on stop
        verbose=1
    )

    reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,                # halves the learning rate
        patience=3,                # after 3 epochs of no improvement
        min_lr=1e-7,               # never goes below this
        verbose=1
    )

    return [checkpoint_callback, csv_logger, early_stopping, reduce_lr]


# ── Resume State Helper ──────────────────────────────────────
def get_initial_epoch(phase="initial"):
    """
    Reads the training log CSV to determine which epoch
    training stopped at. Pass this as initial_epoch to
    model.fit() when resuming so Keras doesn't restart
    epoch numbering from 0.

    Returns 0 if no log exists (fresh start).
    """
    log_path = os.path.join(CHECKPOINT_DIR, f'{phase}_training_log.csv')

    if not os.path.exists(log_path):
        return 0

    with open(log_path, 'r') as f:
        lines = f.readlines()

    # First line is header, subsequent lines are epochs
    completed_epochs = len(lines) - 1
    print(f"Resuming from epoch {completed_epochs + 1}")
    return completed_epochs