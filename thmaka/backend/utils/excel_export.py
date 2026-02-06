import pandas as pd

def export_excel(result):
    rows = []
    for q, info in result["detail"].items():
        rows.append([
            q,
            info["user"],
            info["correct"],
            "Đúng" if info["result"] else "Sai"
        ])

    df = pd.DataFrame(rows, columns=["Câu", "Chọn", "Đáp án", "KQ"])
    path = "uploads/result.xlsx"
    df.to_excel(path, index=False)
    return path
