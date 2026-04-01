import { useEffect, useRef, useState } from "react";
import { useApp } from "../store";
import { detectOMR } from "../utils/omr";
import { calcScore } from "../utils/scoring";

export default function Scan() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { answers, addResult } = useApp();

  const [score, setScore] = useState(null);
  const [overlay, setOverlay] = useState(null);

  // bật camera sau
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error("Không thể truy cập camera:", err));
  }, []);

  // auto scan
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.drawImage(videoRef.current, 0, 0);

      // detect OMR
      const result = detectOMR(canvas);

      if (result && result.code) {
        const correct = answers[result.code];
        if (!correct) return;

        const sc = calcScore(result, correct);
        setScore(sc);

        // vẽ overlay đúng/sai + ô căn chỉnh
        const overlayCanvas = drawOverlay(canvas, result, correct);
        setOverlay(overlayCanvas.toDataURL());

        // lưu kết quả
        addResult({
          img: canvas.toDataURL(),
          score: sc,
          time: Date.now()
        });

        console.log("Đã chấm xong:", sc);
      }

    }, 2000); // quét mỗi 2s

    return () => clearInterval(interval);
  }, [answers]);

  // vẽ highlight đúng/sai và 4 ô căn chỉnh
  const drawOverlay = (canvas, student, correct) => {
    const c = document.createElement("canvas");
    c.width = canvas.width;
    c.height = canvas.height;

    const ctx = c.getContext("2d");
    ctx.drawImage(canvas, 0, 0);

    // ===== 4 ô căn chỉnh góc =====
    const margin = 20; // khoảng cách từ viền canvas
    const size = 80;   // kích thước ô vuông
    ctx.strokeStyle = "lime"; // màu viền
    ctx.lineWidth = 4;

    ctx.strokeRect(margin, margin, size, size); // trên trái
    ctx.strokeRect(canvas.width - margin - size, margin, size, size); // trên phải
    ctx.strokeRect(margin, canvas.height - margin - size, size, size); // dưới trái
    ctx.strokeRect(canvas.width - margin - size, canvas.height - margin - size, size, size); // dưới phải

    // ===== PHẦN 1 =====
    for (let i = 0; i < 40; i++) {
      const isCorrect = student.part1[i] === correct.part1[i];
      ctx.fillStyle = isCorrect ? "rgba(0,255,0,0.4)" : "rgba(255,0,0,0.4)";

      // ⚠️ TỌA ĐỘ demo (cần chỉnh theo form thật)
      let x = 50 + (i % 10) * 50;
      let y = 100 + Math.floor(i / 10) * 40;

      ctx.fillRect(x, y, 30, 30);
    }

    // ===== PHẦN 2 =====
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++) {
        const isCorrect = student.part2[i]?.[j] === correct.part2[i]?.[j];
        ctx.fillStyle = isCorrect ? "rgba(0,255,0,0.4)" : "rgba(255,0,0,0.4)";

        let x = 400 + j * 40;
        let y = 100 + i * 40;

        ctx.fillRect(x, y, 30, 30);
      }
    }

    // ===== PHẦN 3 =====
    for (let i = 0; i < 6; i++) {
      const isCorrect = student.part3[i] === correct.part3[i];
      ctx.fillStyle = isCorrect ? "rgba(0,255,0,0.4)" : "rgba(255,0,0,0.4)";

      let x = 100 + i * 80;
      let y = 500;

      ctx.fillRect(x, y, 40, 40);
    }

    return c;
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* BACK */}
      <button onClick={() => window.history.back()}>
        ⬅ Back
      </button>

      <h2>Chấm bài</h2>

      {/* CAMERA */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "60%", border: "2px solid black" }}
      />

      {/* canvas ẩn */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* overlay kết quả */}
      {overlay && (
        <div>
          <h3>Kết quả chấm</h3>
          <img src={overlay} style={{ width: "60%" }} />
        </div>
      )}

      {/* điểm góc phải */}
      {score !== null && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "black",
          color: "white",
          padding: 10,
          fontSize: 20
        }}>
          Điểm: {score.toFixed(2)}
        </div>
      )}
    </div>
  );
}