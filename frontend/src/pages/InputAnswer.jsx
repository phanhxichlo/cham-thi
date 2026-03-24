import { useState } from "react";
import MCQGrid from "../components/MCQGrid";
import TFGrid from "../components/TFGrid";
import ShortGrid from "../components/ShortGrid";

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
    <div>
      <button onClick={() => history.back()}>⬅ Back</button>
      <h2>Nhập đáp án</h2>

      Mã đề:
      <input value={code} onChange={e => setCode(e.target.value)} />

      <h3>Phần 1</h3>
      <MCQGrid data={part1} setData={setPart1} />

      <h3>Phần 2</h3>
      <TFGrid data={part2} setData={setPart2} />

      <h3>Phần 3</h3>
      <ShortGrid data={part3} setData={setPart3} />

      <button onClick={save}>Lưu</button>
    </div>
  );
}