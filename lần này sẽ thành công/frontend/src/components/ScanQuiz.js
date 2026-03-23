import React, { useState, useRef, useEffect } from "react";

export default function ScanQuiz({ examCode, onBack, onScored }) {
  const videoRef = useRef(null);
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    async function setupCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    }
    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Giả lập tự động lấy ảnh camera và gửi backend
  const handleScan = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image_base64 = canvas.toDataURL("image/jpeg");

    const res = await fetch("http://localhost:5000/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exam_code: examCode, image_base64 }),
    });
    const data = await res.json();
    if (!data.error) {
      setScoreData(data);
      onScored(data);
    } else {
      alert("Chưa có đáp án hoặc lỗi khi chấm");
    }
  };

  useEffect(() => {
    // Giả lập auto scan sau 3s (thực tế bạn có thể setup vòng lặp hoặc nút)
    const timeout = setTimeout(() => {
      handleScan();
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <button onClick={onBack}>Quay lại</button>
      <h2>Quét bài thi mã đề: {examCode}</h2>
      <video ref={videoRef} autoPlay style={{ width: "100%", maxWidth: 600 }} />
      {scoreData && (
        <div>
          <h3>Điểm: {scoreData.score}</h3>
          {/* Ở đây bạn có thể vẽ thêm các dấu hiệu tô xanh đỏ dựa vào scoreData.details */}
        </div>
      )}
    </div>
  );
}