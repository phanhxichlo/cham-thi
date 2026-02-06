import json

with open("backend/data/answer_keys.json", "r", encoding="utf-8") as f:
    ANSWERS = json.load(f)

def grade_answers(detected):
    score = 0
    detail = {}

    for q, correct in ANSWERS.items():
        user_ans = detected.get(int(q))
        is_correct = user_ans == correct
        detail[q] = {
            "user": user_ans,
            "correct": correct,
            "result": is_correct
        }
        if is_correct:
            score += 1

    return {
        "score": score,
        "detail": detail
    }
