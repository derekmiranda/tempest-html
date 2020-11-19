const _circleMemo = {};
export function circle(segments) {
  if (!_circleMemo[segments]) {
    const segmentAngle: number = (2 * Math.PI) / segments;
    const pts = [];
    for (let i = 0; i < segments; i++) {
      const angle = segmentAngle * i;
      pts.push({
        x: 0.5 * Math.cos(angle),
        y: 0.5 * Math.sin(angle),
      });
    }
    _circleMemo[segments] = pts;
  }
  return _circleMemo[segments]; //.slice()
}
