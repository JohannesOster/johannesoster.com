export const rad = (deg: number) => (deg * Math.PI) / 180;
export const deg = (rad: number) => (rad * 180) / Math.PI;

// https://en.wikipedia.org/wiki/Rotation_matrix
type Rotation = { x: number; y: number; angle: number; originOffset?: Point2D };
type Point2D = { x: number; y: number };
export const rot2D = (props: Rotation): Point2D => {
  const { x, y, angle, originOffset = { x: 0, y: 0 } }: Rotation = props;
  const radAngle = rad(angle);
  return {
    x: x * Math.cos(radAngle) - y * Math.sin(radAngle) + originOffset.x,
    y: x * Math.sin(radAngle) + y * Math.cos(radAngle) + originOffset.y,
  };
};

// minus because coordinate system is flipped
export const pendulum2D = (l: number, angle: number): Point2D => {
  return rot2D({ x: 0, y: l, angle, originOffset: { x: 0, y: -l } });
};

// https://scienceworld.wolfram.com/physics/DoublePendulum.html
// While in a real world double pendulum the angles/masses are not independent, in these calculations
// the position of the second pendulum can just be calculated as a superposition of two independent pendulum-like motions
export const doublePendulum2D = (
  l1: number,
  l2: number,
  angle1: number,
  angle2: number
): Point2D => {
  const { x: x1, y: y1 } = pendulum2D(l1, angle1);
  const { x: x2, y: y2 } = pendulum2D(l2, angle2);
  return { x: x1 + x2, y: y1 + y2 };
};

export const dx = (l: number, angle: number) => -l * Math.sin(rad(angle));
export const dy = (l: number, angle: number) => -l * (1 - Math.cos(rad(angle)));
