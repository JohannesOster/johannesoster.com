const rad = (deg: number) => (deg * Math.PI) / 180;
// minus because coordinate system is flipped
export const dx = (l: number, angle: number) => -l * Math.sin(rad(angle));
export const dy = (l: number, angle: number) => -l * (1 - Math.cos(rad(angle)));
