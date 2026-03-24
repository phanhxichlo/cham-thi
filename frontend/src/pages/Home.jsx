import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>PHẦN MỀM CHẤM THI</h1>

      <button onClick={() => nav("/input")}>Nhập đáp án</button><br/><br/>
      <button onClick={() => nav("/scan")}>Chấm bài</button><br/><br/>
      <button onClick={() => nav("/review")}>Xem bài</button>
    </div>
  );
}