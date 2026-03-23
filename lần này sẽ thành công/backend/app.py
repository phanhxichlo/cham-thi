# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import io
from PIL import Image
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
app = Flask(__name__)
CORS(app)

# Dữ liệu lưu tạm (đáp án chuẩn từng mã đề)
answer_keys = {}

@app.route("/save_answers", methods=["POST"])
def save_answers():
    data = request.json
    code = data.get("exam_code")
    answers = data.get("answers")
    if not code or not answers:
        return jsonify({"error": "Missing exam_code or answers"}), 400
    answer_keys[code] = answers
    return jsonify({"message": "Lưu thành công"})

@app.route("/grade", methods=["POST"])
def grade():
    data = request.json
    code = data.get("exam_code")
    img_base64 = data.get("image_base64")

    if code not in answer_keys:
        return jsonify({"error": "Chưa có đáp án cho mã đề này"}), 400

    # Giải mã ảnh base64
    img_data = base64.b64decode(img_base64.split(",")[1])
    img = Image.open(io.BytesIO(img_data))
    img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

    # TODO: Xử lý ảnh nhận diện đáp án tự động theo mẫu phiếu bạn gửi
    # Giả sử ta nhận dạng được đáp án dạng dict student_answers = {...}
    # Đây là phần phức tạp, bạn sẽ cần căn chỉnh vùng quét (ROI),
    # Đếm pixel đen trên từng ô, phát hiện ô tô, tô xanh/đỏ.

    # Demo giả lập điểm số:
    student_answers = {
        "1": "A",
        "2": "B",
        "3": "C",
        # ...
    }

    key_answers = answer_keys[code]
    score = 0
    details = {}

    for q, ans in key_answers.items():
        student_ans = student_answers.get(q, "")
        correct = student_ans == ans
        details[q] = {
            "student_answer": student_ans,
            "correct_answer": ans,
            "correct": correct,
            "pos": [100, 100, 30]  # ví dụ vị trí tô highlight (x, y, radius)
        }
        if correct:
            score += 1

    return jsonify({"score": score, "details": details})

if __name__ == "__main__":
    app.run(debug=True)
    