import { useState } from "react";

// ======= Phần 1: MCQGrid (18 câu) =======
function MCQGrid({ data, setData }) {
  const questions = Array.from({ length: 18 }, (_, i) => i + 1);
  const options = ["A", "B", "C", "D"];

  const setAnswer = (q, opt) => {
    setData({ ...data, [q]: opt });
  };

  return (
    <div>
      {questions.map((q) => (
        <div key={q} style={{ marginBottom: "15px" }}>
          <div>Câu {q}:</div>
          <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswer(q, opt)}
                style={{
                  padding: "12px 18px",
                  fontSize: "18px",
                  borderRadius: "8px",
                  background: data[q] === opt ? "#4caf50" : "#eee",
                  color: data[q] === opt ? "white" : "black",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ======= Phần 2: TFGrid (4 câu x 4 ý) =======
function TFGrid({ data, setData }) {
  const questions = [1, 2, 3, 4]; // 4 câu
  const options = ["A", "B", "C", "D"];

  const setAnswer = (key, value) => {
    setData({ ...data, [key]: value });
  };

  return (
    <div>
      {questions.map((q) =>
        options.map((opt) => {
          const key = `${q}${opt}`;
          return (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                gap: "10px",
              }}
            >
              <span style={{ width: "40px" }}>{key}</span>

              <button
                onClick={() => setAnswer(key, true)}
                style={{
                  padding: "8px 12px",
                  background: data[key] === true ? "green" : "#ddd",
                  color: data[key] === true ? "white" : "black",
                }}
              >
                Đúng
              </button>

              <button
                onClick={() => setAnswer(key, false)}
                style={{
                  padding: "8px 12px",
                  background: data[key] === false ? "red" : "#ddd",
                  color: data[key] === false ? "white" : "black",
                }}
              >
                Sai
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

// ======= Phần 3: ShortGrid (6 câu nhập số/dấu) =======
function ShortGrid({ data, setData }) {
  const questions = Array.from({ length: 6 }, (_, i) => i + 1);

  // Hàm kiểm tra định dạng hợp lệ
  const isValidAnswer = (value) => {
    // Cho phép tối đa 4 số hoặc 3 số + 1 dấu, hoặc 2 số + 1 dấu + 1 dấu, hoặc 1 dấu + 3 số
    // regex này chấp nhận số từ 1-4 chữ số, dấu '-' và dấu '.' kết hợp
    return /^-?\d{1,4}(\.\d{1,3})?$/.test(value);
  };

  return (
    <div>
      {questions.map((q) => {
        const value = data[q] || "";
        const valid = value === "" || isValidAnswer(value);

        return (
          <div key={q} style={{ marginBottom: "12px" }}>
            <span>Câu {q}: </span>

            <input
              value={value}
              onChange={(e) =>
                setData({ ...data, [q]: e.target.value })
              }
              style={{
                padding: "8px",
                width: "120px",
                textAlign: "center",
                border: valid ? "1px solid #ccc" : "2px solid red",
              }}
            />

            {!valid && (
              <div style={{ color: "red", fontSize: "13px" }}>
                Đáp án không hợp lệ
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ======= Component chính: InputAnswer =======
export default function InputAnswer() {
  const [code, setCode] = useState("");
  const [part1, setPart1] = useState({});
  const [part2, setPart2] = useState({});
  const [part3, setPart3] = useState({});

  const save = () => {
    let data = { part1, part2, part3 };
    let all = JSON.parse(localStorage.getItem("answers") || "{}");
    all[code] = data;
    localStorage.setItem("answers", JSON.stringify(all));
    alert("Đã lưu đáp án");
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => history.back()}>⬅ Back</button>
      <h2>Nhập đáp án</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Mã đề: </label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ padding: "6px", width: "120px" }}
        />
      </div>

      <h3>Phần 1 – Trắc nghiệm (18 câu)</h3>
      <MCQGrid data={part1} setData={setPart1} />

      <h3>Phần 2 – Đúng/Sai theo ý (4 câu x 4 ý)</h3>
      <TFGrid data={part2} setData={setPart2} />

      <h3>Phần 3 – Nhập đáp án số (6 câu)</h3>
      <ShortGrid data={part3} setData={setPart3} />

      <button
        onClick={save}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
          background: "#2196f3",
          color: "white",
        }}
      >
        Lưu
      </button>
    </div>
  );
}