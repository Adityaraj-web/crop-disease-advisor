import numpy as np
import tensorflow as tf
from app.config import settings
from app.utils.disease_labels import DISEASE_LABELS


class ModelService:
    def __init__(self):
        self._model = None

    def load(self) -> None:
        """
        Load the SavedModel from disk. Called once at startup via
        the FastAPI lifespan handler in main.py.
        """
        self._model = tf.saved_model.load(settings.model_path)
        self._infer = self._model.signatures["serving_default"]

    def predict(self, image_array: np.ndarray) -> list[dict]:
        """
        Run inference on a preprocessed image array.

        Args:
            image_array: float32 ndarray of shape (1, 300, 300, 3),
                         pixel values in [0, 255].

        Returns:
            List of top-3 predictions, each a dict with keys:
                - label (str): human-readable disease name
                - index (int): class index
                - confidence (float): probability in [0, 1]
            Sorted descending by confidence.
        """
        if self._model is None:
            raise RuntimeError("Model is not loaded. Call load() first.")

        tensor = tf.constant(image_array, dtype=tf.float32)
        output = self._infer(tensor)

        # Output key confirmed in notebook 06 sanity check
        probabilities = output["output_0"].numpy()[0]

        top3_indices = np.argsort(probabilities)[::-1][:3]

        return [
            {
                "label": DISEASE_LABELS[int(idx)],
                "index": int(idx),
                "confidence": float(probabilities[idx]),
            }
            for idx in top3_indices
        ]
    


# Module-level singleton — imported and used across routers
model_service = ModelService()