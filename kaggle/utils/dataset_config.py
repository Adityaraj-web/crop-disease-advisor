import os

# ── Paths ────────────────────────────────────────────────────
BASE_DATASET_PATH = '/kaggle/input/datasets/abdallahalidev/plantvillage-dataset/color'
WORKING_DIR       = '/kaggle/working'
CHECKPOINT_DIR    = os.path.join(WORKING_DIR, 'checkpoints')
LOG_DIR           = os.path.join(WORKING_DIR, 'logs')
EXPORT_DIR        = os.path.join(WORKING_DIR, 'exports')

# Create directories if they don't exist
for directory in [CHECKPOINT_DIR, LOG_DIR, EXPORT_DIR]:
    os.makedirs(directory, exist_ok=True)

# ── Model Input ──────────────────────────────────────────────
IMAGE_SIZE    = (300, 300)   # EfficientNetB3 native input size
IMAGE_SHAPE   = (300, 300, 3)
BATCH_SIZE    = 32
NUM_CLASSES   = 38

# ── Training ─────────────────────────────────────────────────
INITIAL_EPOCHS     = 30     # Phase 1: frozen base training
FINE_TUNE_EPOCHS   = 20     # Phase 2: partial unfreeze training
LEARNING_RATE      = 1e-3   # Initial learning rate for head training
FINE_TUNE_LR       = 1e-5   # Lower LR for fine tuning pass
TRAIN_SPLIT        = 0.8
VAL_SPLIT          = 0.1
TEST_SPLIT         = 0.1    # Must sum to 1.0 with above two
RANDOM_SEED        = 42     # Fixed seed for reproducibility

# ── All 38 Class Names (PlantVillage color dataset) ──────────
CLASS_NAMES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy',
]

# ── Sanity Check ─────────────────────────────────────────────
# Run this to verify class names match actual folders
def verify_classes():
    actual = sorted(os.listdir(BASE_DATASET_PATH))
    expected = sorted(CLASS_NAMES)
    
    if actual == expected:
        print(f"✓ All {NUM_CLASSES} classes verified successfully")
    else:
        missing  = set(expected) - set(actual)
        extra    = set(actual) - set(expected)
        if missing:
            print(f"✗ Missing folders: {missing}")
        if extra:
            print(f"✗ Unexpected folders: {extra}")

verify_classes()