// frontend/src/utils/omrConfig.js

export const OMR_CONFIG = {
  width: 1920,
  height: 2755,

  // ===== Marker lớn (vùng warp giấy) =====
  markerLarge: [
    { x: 86, y: 77 },
    { x: 86, y: 873 },
    { x: 86, y: 2655 },
    { x: 1376, y: 77 },
    { x: 1832, y: 77 },
    { x: 1380, y: 842 },
    { x: 1832, y: 842 },
    { x: 1832, y: 2655 }
  ],
  markerLargeSize: { width: 50, height: 50 }, // vùng detect lớn để warp

  // ===== Marker nhỏ =====
  markerSmall: [
    { x: 1662, y: 516 },
    { x: 1662, y: 790 },
    { x: 549, y: 966 },
    { x: 959, y: 966 },
    { x: 1370, y: 966 },
    { x: 549, y: 1455 },
    { x: 960, y: 1455 },
    { x: 1370, y: 1455 },
    { x: 549, y: 1525 },
    { x: 960, y: 1525 },
    { x: 1370, y: 1525 },
    { x: 549, y: 1813 },
    { x: 960, y: 1813 },
    { x: 1370, y: 1813 }
  ],
  markerSmallSize: { width: 25, height: 38 },
  markerSmallThreshold: 0.5, // 50% pixel tô là nhận diện

  // ===== Marker phụ khác =====
  markerExtra: [
    { x: 433, y: 1848 },
    { x: 696, y: 1848 },
    { x: 1222, y: 1848 },
    { x: 1484, y: 1848 },
    { x: 1222, y: 2589 },
    { x: 1484, y: 2589 },
    { x: 433, y: 2589 },
    { x: 696, y: 2589 },
    { x: 958, y: 2589 }
  ],
  markerExtraSize: { width: 34, height: 25 },
  markerExtraThreshold: 0.5,

  // ===== Mã đề 3 chữ số =====
  codeGrid: {
    startX: 1691,
    startY: 245,
    endX: 1803,
    endY: 793,
    rows: 10, // dọc = 0-9
    cols: 3,  // ngang = 3 số
    fillThreshold: 0.8 // 80% pixel tô = chọn ô
  }
};