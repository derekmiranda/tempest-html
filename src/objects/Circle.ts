import { Point } from "../types";

function drawCircle(
  origin: Point,
  radius: number,
  segments: number = 16
): void {
  const segmentAngle: number = (2 * Math.PI) / segments;

  let firstX: number, firstY: number;

  ctx.strokeStyle = COLORS.LINE;
  ctx.beginPath();
  for (let i = 0; i < segments; i++) {
    const angle = segmentAngle * i;

    const x = origin.x + radius * Math.cos(angle),
      y = origin.y + radius * Math.sin(angle);

    if (i === 0) {
      firstX = x;
      firstY = y;
      ctx.moveTo(x * canvas.width, y * canvas.height);
    } else {
      ctx.lineTo(x * canvas.width, y * canvas.height);
    }
  }
  ctx.lineTo(firstX * canvas.width, firstY * canvas.height);
  ctx.closePath();
  ctx.stroke();
}
