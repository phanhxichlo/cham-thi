import React, { useState } from "react";

const sampleQuestions = {
  "1": { type: "MCQ", text: "Câu 1" },
  "2": { type: "MCQ", text: "Câu 2" },
  "3": { type: "TF", text: "Câu 3" },
  "4": { type: "Short", text: "Câu 4" }
};

export default function AnswerInput({ examCode, onBack, onSaved }) {
  const [answers, setAnswers] = useState({});

  const handleChange = (q, val) => {
    setAnswers((prev) => ({ ...prev, [q]: val }));
  };

  const saveAnswers = async () => {
    if (!examCode) return alert("Mã đề không tồn tại");
    const res = await fetch("http://localhost:5000/save_answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exam_code: examCode, answers }),
    });
    const data = await res.json();
    if (data.message) onSaved();
  };

  return (
    <div>
      <button onClick={onBack}>Quay lại</button>
      <h2>Nhập đáp án cho mã đề: {examCode}</h2>
      {Object.entries(sampleQuestions).map(([q, { type, text }]) => (
        <div key={q} style={{ marginBottom: 10 }}>
          <label>{text} ({type}): </label>
          {type === "MCQ" && ["A", "B", "C", "D"].map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name={`q${q}`}
                value={opt}
                checked={answers[q] === opt}
                onChange={() => handleChange(q, opt)}
              />
              {opt}
            </label>
          ))}
          {type === "TF" && ["True", "False"].map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name={`q${q}`}
                value={opt}
                checked={answers[q] === opt}
                onChange={() => handleChange(q, opt)}
              />
              {opt}
            </label>
          ))}
          {type === "Short" && (
            <input
              type="text"
              value={answers[q] || ""}
              onChange={(e) => handleChange(q, e.target.value)}
              maxLength={4}
              placeholder="Trả lời ngắn tối đa 4 ký tự"
            />
          )}
        </div>
      ))}
      <button onClick={saveAnswers}>Lưu đáp án</button>
    </div>
  );
}