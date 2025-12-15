def grade_part1(student, correct):
    score = 0
    detail = {}
    for q, ans in correct.items():
        q = int(q)
        s = student.get(q)
        if s == ans:
            score += 0.25
            st = "correct"
        elif s is None:
            st = "blank"
        else:
            st = "wrong"
        detail[q] = {"student": s, "correct": ans, "status": st}
    return score, detail


def grade_part2(student, correct):
    score = 0
    detail = {}
    for q, corr in correct.items():
        q = int(q)
        right = 0
        for opt in ["a", "b", "c", "d"]:
            if student[q].get(opt) == corr.get(opt):
                right += 1

        if right <= 1:
            pts = 0.10
        elif right == 2:
            pts = 0.25
        elif right == 3:
            pts = 0.50
        else:
            pts = 1.00

        score += pts
        detail[q] = {
            "student": student[q],
            "correct": corr,
            "right": right,
            "score": pts
        }
    return score, detail


def grade_part3(student, correct):
    score = 0
    detail = {}
    for q, ans in correct.items():
        q = int(q)
        s = student.get(q)
        if s == ans:
            score += 0.25
            st = "correct"
        elif s is None:
            st = "blank"
        else:
            st = "wrong"
        detail[q] = {"student": s, "correct": ans, "status": st}
    return score, detail