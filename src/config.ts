const SCALE = 1;

export const config = {
  id: "stickman",
  scale: SCALE,

  headRadius: 32 * SCALE,
  bodyLength: 96 * SCALE,
  upperArmLength: 55 * SCALE,
  forearmLength: 38 * SCALE,
  thighLength: 48 * SCALE,
  shinLength: 46 * SCALE,
  footLength: 13 * SCALE,
  neckLength: 9 * SCALE,
  jointRadius: 2 * SCALE,
  footYOffset: 1 * SCALE, // slightly move foot up to add overlap with shin
  strokeWidth: 4 * SCALE,
  strokeColor: "#21211f",

  limbDisposition: 2 * SCALE, // move limbs out form center

  // Rotation
  shoulderAngle: 15,
  elbowAngle: 5,
  hipAngle: 10,
  kneeAngle: 2,
  ankleAngle: 80,
};
