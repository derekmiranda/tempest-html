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

const _squareMemo = {};
export function square(segments) {
  if (!_squareMemo[segments]) {
    const pts = [];
    // draw points from top-right to bottom-right to bottom-left to top-left and back
    const segQtrNum = Math.floor(segments / 4);
    for (let i = 0; i < segments; i++) {
      switch (Math.floor((4 * i) / segments)) {
        // from top-right to bottom-right
        case 0:
          pts.push({
            x: 0.5,
            y: -0.5 + i / segQtrNum,
          });
          break;
        // from bottom-right to bottom-left
        case 1:
          pts.push({
            x: 0.5 - (i - segQtrNum) / segQtrNum,
            y: 0.5,
          });
          break;
        // from bottom-left to top-left
        case 2:
          pts.push({
            x: -0.5,
            y: 0.5 - (i - 2 * segQtrNum) / segQtrNum,
          });
          break;
        // from top-left to top-right
        case 3:
          pts.push({
            x: -0.5 + (i - 3 * segQtrNum) / segQtrNum,
            y: -0.5,
          });
      }
    }
    _squareMemo[segments] = pts;
  }
  return _squareMemo[segments];
}
