import React from "react";

export default function ResultReview({ data, onBack }) {
  if (!data) return <div>Chưa có dữ liệu điểm</div>;
  return (
    <div>
      <button onClick={onBack}>Quay lại</button>
      <h2>Kết quả bài thi</h2>
      <p>Điểm: {data.score}</p>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Câu</th>
            <th>Đáp án học sinh</th>
            <th>Đáp án đúng</th>
            <th>Đúng/Sai</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.details).map(([q, val]) => (
            <tr key={q}>
              <td>{q}</td>
              <td>{val.student_answer}</td>
              <td>{val.correct_answer}</td>
              <td>{val.correct ? "Đúng" : "Sai"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}