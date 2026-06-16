import numpy as np
from PIL import Image, UnidentifiedImageError
import io


# Must match training exactly — EfficientNetB3 input size
TARGET_SIZE = (300, 300)


def decode_and_preprocess(image_bytes: bytes) -> np.ndarray:
    """
    Decode raw image bytes uploaded via the API and preprocess
    for EfficientNetB3 inference.

    Returns a float32 array of shape (1, 300, 300, 3) with pixel
    values in [0, 255] — EfficientNetB3 handles internal normalization.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
    except UnidentifiedImageError:
        raise ValueError("Uploaded file is not a valid image.")

    # Convert to RGB — handles RGBA, grayscale, palette-mode uploads
    image = image.convert("RGB")

    # Resize to model input size using high-quality downsampling
    image = image.resize(TARGET_SIZE, Image.LANCZOS)

    # Convert to numpy array — shape (300, 300, 3), dtype uint8
    array = np.array(image, dtype=np.float32)

    # Add batch dimension — shape (1, 300, 300, 3)
    array = np.expand_dims(array, axis=0)

    return array


def validate_image_size(image_bytes: bytes, max_mb: float = 10.0) -> None:
    """
    Raises ValueError if the uploaded image exceeds max_mb.
    Call this before decode_and_preprocess.
    """
    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > max_mb:
        raise ValueError(f"Image too large: {size_mb:.1f}MB. Maximum allowed is {max_mb}MB.")