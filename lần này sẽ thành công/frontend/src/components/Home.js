import React from "react";

export default function Home({ onSelectPage, setExamCode }) {
  const handleSelect = (page) => {
    if (page === "answerInput") {
      const code = prompt("Nhập mã đề để nhập đáp án:");
      if (!code) return alert("Phải nhập mã đề");
      setExamCode(code);
    }
    if (page === "scanQuiz") {
      const code = prompt("Nhập mã đề để quét bài:");
      if (!code) return alert("Phải nhập mã đề");
      setExamCode(code);
    }
    onSelectPage(page);
  };

  return (
    <div>
      <h1>Phần mềm chấm bài trắc nghiệm</h1>
      <button onClick={() => handleSelect("answerInput")}>1. Nhập đáp án</button>
      <br />
      <button onClick={() => handleSelect("scanQuiz")}>2. Quét bài</button>
      <br />
      <button onClick={() => handleSelect("resultReview")}>3. Xem bài đã chấm</button>
    </div>
  );
}