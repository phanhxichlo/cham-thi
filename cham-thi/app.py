from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
from uuid import uuid4

from omr import (
    detect_part1,
    detect_part2,
    detect_part3,
    detect_exam_code
)
from grading import (
    grade_part1,
    grade_part2,
    grade_part3
)
from answer_store import load_keys, save_keys

# =======================
# Flask app
# =======================
app = Flask(__name__)

TEMP = {}

# =======================
# Routes
# =======================

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/admin")
def admin():
    return render_template("admin.html")


@app.route("/camera")
def camera():
    return render_template("camera.html")


@app.route("/save-answer", methods=["POST"])
def save_answer():
    data = request.json

    keys = load_keys()
    keys[data["code"]] = data["answers"]
    save_keys(keys)

    return jsonify({"status": "ok"})


@app.route("/scan", methods=["POST"])
def scan():
    file = request.files["image"]

    # Read image
    img = cv2.imdecode(
        np.frombuffer(file.read(), np.uint8),
        cv2.IMREAD_COLOR
    )

    # Detect exam code & answers
    code = detect_exam_code(img)
    keys = load_keys().get(code)

    if not keys:
        return jsonify({"error": "Exam code not found"}), 400

    p1 = detect_part1(img)
    p2 = detect_part2(img)
    p3 = detect_part3(img)

    s1, d1 = grade_part1(p1, keys["part1"])
    s2, d2 = grade_part2(p2, keys["part2"])
    s3, d3 = grade_part3(p3, keys["part3"])

    total = round(s1 + s2 + s3, 2)

    result = {
        "exam_code": code,
        "score": total,
        "max": 19.5,
        "part1": d1,
        "part2": d2,
        "part3": d3
    }

    rid = str(uuid4())
    TEMP[rid] = result

    return jsonify({"id": rid})


@app.route("/result/<rid>")
def result(rid):
    if rid not in TEMP:
        return jsonify({"error": "Result not found"}), 404

    return jsonify(TEMP[rid])


# =======================
# Run locally
# =======================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
