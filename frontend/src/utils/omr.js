import { OMR_CONFIG } from "./omrConfig";

export function detectOMR(canvas) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // ===== 1. grayscale =====
  let gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  // ===== 2. threshold =====
  const threshold = 150;
  let binary = new Uint8ClampedArray(width * height);
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
    return count / (w * h);
  };

  const result = {
    code: "",
    markersLarge: [],
    markersSmall: [],
    markersExtra: [],
    part1: {},
    part2: {},
    part3: {}
  };

  // ===== MARKER LỚN =====
  OMR_CONFIG.markerLarge.forEach((m) => {
    const ratio = countBlack(
      m.x,
      m.y,
      OMR_CONFIG.markerLargeSize.width,
      OMR_CONFIG.markerLargeSize.height
    );
    result.markersLarge.push({
      ...m,
      detected: ratio >= 0.5
    });
  });

  // ===== MARKER NHỎ =====
  OMR_CONFIG.markerSmall.forEach((m) => {
    const ratio = countBlack(
      m.x,
      m.y,
      OMR_CONFIG.markerSmallSize.width,
      OMR_CONFIG.markerSmallSize.height
    );
    result.markersSmall.push({
      ...m,
      detected: ratio >= OMR_CONFIG.markerSmallThreshold
    });
  });

  // ===== MARKER PHỤ =====
  OMR_CONFIG.markerExtra.forEach((m) => {
    const ratio = countBlack(
      m.x,
      m.y,
      OMR_CONFIG.markerExtraSize.width,
      OMR_CONFIG.markerExtraSize.height
    );
    result.markersExtra.push({
      ...m,
      detected: ratio >= OMR_CONFIG.markerExtraThreshold
    });
  });

  // ===== LẤY TỌA ĐỘ 4 GÓC THỰC TẾ =====
  const detectedMarkers = result.markersLarge.filter(m => m.detected);
  if (detectedMarkers.length >= 4) {
    // lấy 4 marker theo thứ tự: top-left, top-right, bottom-left, bottom-right
    const [tl, tr, bl, br] = detectedMarkers.slice(0,4);

    // tính scale + offset cho mỗi trục
    const scaleX = (tr.x - tl.x) / (OMR_CONFIG.markerRef.tr.x - OMR_CONFIG.markerRef.tl.x);
    const scaleY = (bl.y - tl.y) / (OMR_CONFIG.markerRef.bl.y - OMR_CONFIG.markerRef.tl.y);
    const offsetX = tl.x - OMR_CONFIG.markerRef.tl.x * scaleX;
    const offsetY = tl.y - OMR_CONFIG.markerRef.tl.y * scaleY;

    // hàm map tọa độ cố định -> tọa độ thực tế
    var mapCoord = (x, y) => [x * scaleX + offsetX, y * scaleY + offsetY];
  } else {
    // nếu không đủ marker, dùng tọa độ gốc
    var mapCoord = (x, y) => [x, y];
  }

  // ===== MÃ ĐỀ 3 CHỮ SỐ =====
  const startX = 1693;
  const startY = 243;
  const endX = 1802;
  const endY = 790;
  const cols = 3;
  const rows = 10;
  const cellW = (endX - startX) / cols;
  const cellH = (endY - startY) / rows;
  const margin = 3;
  let code = "";
  let isValid = true;
  let totalFilled = 0;

  for (let col = 0; col < cols; col++) {
    let filledRows = [];
    for (let row = 0; row < rows; row++) {
      const x0 = startX + col * cellW;
      const y0 = startY + row * cellH;
      const [tx, ty] = mapCoord(x0 + margin, y0 + margin);
      const [tW, tH] = [cellW - 2 * margin, cellH - 2 * margin].map(v => v * (scaleX||1));

      const ratio = countBlack(Math.floor(tx), Math.floor(ty), Math.floor(tW), Math.floor(tH));
      if (ratio >= 0.5) filledRows.push(row);
    }
    if (filledRows.length === 1) {
      code += filledRows[0];
      totalFilled++;
    } else {
      code += "-";
      isValid = false;
    }
  }
  result.code = totalFilled === 3 && isValid ? code : "invalid";

  // ===== PHẦN 1 (10 câu ABCD) =====
  const part1Grids = {
    A: { startX: 226, startY: 1009, endX: 261, endY: 1438 },
    B: { startX: 307, startY: 1009, endX: 344, endY: 1438 },
    C: { startX: 390, startY: 1009, endX: 427, endY: 1438 },
    D: { startX: 470, startY: 1009, endX: 508, endY: 1438 },
  };

  const part1Result = {};
  const letters1 = ["A", "B", "C", "D"];
  letters1.forEach(letter => {
    const grid = part1Grids[letter];
    const cellH1 = (grid.endY - grid.startY) / 10;
    part1Result[letter] = [];
    for (let i = 0; i < 10; i++) {
      const y0 = grid.startY + i * cellH1;
      const [tx, ty] = mapCoord(grid.startX, y0);
      const [tW, tH] = mapCoord(grid.endX, y0); // width = endX - startX, map
      const ratio = countBlack(Math.floor(tx), Math.floor(ty), Math.floor(grid.endX - grid.startX), Math.floor(cellH1));
      part1Result[letter][i] = ratio >= 0.5;
    }
  });

  for (let i = 0; i < 10; i++) {
    const filled = letters1.filter(l => part1Result[l][i]);
    result.part1[i] = filled.length === 1 ? filled[0] : null;
  }

  // ===== PHẦN 2 =====
  const startX2 = 400;
  const startY2 = 100;
  const cellW1 = 30;
  const cellH1 = 30;
  const gapX1 = 40;
  const gapY1 = 40;

  for (let i = 0; i < 8; i++) {
    result.part2[i] = [];
    for (let j = 0; j < 4; j++) {
      const x = startX2 + j * gapX1;
      const y = startY2 + i * gapY1;
      const [tx, ty] = mapCoord(x, y);
      result.part2[i][j] = countBlack(Math.floor(tx), Math.floor(ty), cellW1, cellH1) > 0.3;
    }
  }

  // ===== PHẦN 3 =====
  const startX3 = 100;
  const startY3 = 500;
  for (let i = 0; i < 6; i++) {
    let maxVal = 0;
    let chosen = null;
    for (let n = 0; n < 10; n++) {
      const x = startX3 + i * 80;
      const y = startY3 + n * 30;
      const [tx, ty] = mapCoord(x, y);
      const val = countBlack(Math.floor(tx), Math.floor(ty), 25, 25);
      if (val > maxVal && val > 0.3) {
        maxVal = val;
        chosen = n;
      }
    }
    result.part3[i] = chosen;
  }

  return result;
}