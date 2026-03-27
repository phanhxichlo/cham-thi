export function detectOMR(canvas) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // ===== 1. grayscale =====
  let gray = new Uint8ClampedArray(width * height);

  for (let i = 0; i < data.length; i += 4) {
    let g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    gray[i / 4] = g;
  }

  // ===== 2. threshold =====
  let binary = new Uint8ClampedArray(width * height);
  let threshold = 150;

  for (let i = 0; i < gray.length; i++) {
    binary[i] = gray[i] < threshold ? 1 : 0;
  }

  // ===== helper đếm pixel đen =====
  const countBlack = (x, y, w, h) => {
    let count = 0;

    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        let idx = i * width + j;
        if (binary[idx] === 1) count++;
      }
    }

    return count / (w * h); // tỷ lệ đen
  };

  // =========================
  // ⚠️ QUAN TRỌNG: mapping theo form bạn gửi
  // bạn cần chỉnh lại tọa độ này cho chuẩn 100%
  // =========================

  let result = {
    code: "123", // tạm (bạn có thể scan vùng mã đề sau)
    part1: {},
    part2: {},
    part3: {}
  };

  // ===== PHẦN 1 (40 câu, A B C D) =====
  const startX1 = 50;
  const startY1 = 100;
  const cellW = 30;
  const cellH = 30;
  const gapX = 40;
  const gapY = 40;

  const letters = ["A", "B", "C", "D"];

  for (let i = 0; i < 40; i++) {
    let row = Math.floor(i / 10);
    let col = i % 10;

    let baseX = startX1 + col * 4 * gapX;
    let baseY = startY1 + row * gapY;

    let maxVal = 0;
    let chosen = null;

    for (let j = 0; j < 4; j++) {
      let x = baseX + j * gapX;
      let y = baseY;

      let val = countBlack(x, y, cellW, cellH);

      if (val > maxVal && val > 0.3) {
        maxVal = val;
        chosen = letters[j];
      }
    }

    result.part1[i] = chosen;
  }

  // ===== PHẦN 2 (8 câu đúng sai 4 ô) =====
  const startX2 = 400;
  const startY2 = 100;

  for (let i = 0; i < 8; i++) {
    result.part2[i] = [];

    for (let j = 0; j < 4; j++) {
      let x = startX2 + j * gapX;
      let y = startY2 + i * gapY;

      let val = countBlack(x, y, cellW, cellH);

      result.part2[i][j] = val > 0.3;
    }
  }

  // ===== PHẦN 3 (6 câu số 0-9) =====
  const startX3 = 100;
  const startY3 = 500;

  for (let i = 0; i < 6; i++) {
    let maxVal = 0;
    let chosen = null;

    for (let n = 0; n < 10; n++) {
      let x = startX3 + i * 80;
      let y = startY3 + n * 30;

      let val = countBlack(x, y, 25, 25);

      if (val > maxVal && val > 0.3) {
        maxVal = val;
        chosen = n;
      }
    }

    result.part3[i] = chosen;
  }

  return result;
}