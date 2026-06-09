import random

def predict_disease(image_path):

    diseases = [
        ("Tomato Early Blight", 0.94),
        ("Leaf Mold", 0.89),
        ("Healthy Leaf", 0.97),
        ("Bacterial Spot", 0.91)
    ]

    disease, confidence = random.choice(diseases)

    return {
        "disease": disease,
        "confidence": confidence
    }