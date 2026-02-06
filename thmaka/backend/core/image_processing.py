import cv2
import numpy as np

def process_image(image_bytes):
    # decode ảnh
    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_GRAYSCALE)

    # threshold
    _, thresh = cv2.threshold(img, 150, 255, cv2.THRESH_BINARY_INV)

    # TODO: crop đúng vùng PHẦN I
    # TODO: xác định tọa độ ô A/B/C/D

    detected = {}
    for q in range(1, 41):
        detected[q] = "A"  # demo

    return detected
