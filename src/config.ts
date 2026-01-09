const SCALE = 1;

export const config = {
  id: "stickman",
  scale: SCALE,

  headRadius: 32 * SCALE,
  bodyLength: 96 * SCALE,
  upperArmLength: 55 * SCALE,
  forearmLength: 38 * SCALE,
  thighLength: 48 * SCALE,
  shinLength: 38 * SCALE,
  footLength: 13 * SCALE,
  neckLength: 4 * SCALE, // Halved from 9 to bring head closer to body
  jointRadius: 2 * SCALE,
  footYOffset: 1 * SCALE, // slightly move foot up to add overlap with shin
  strokeWidth: 4 * SCALE,
  strokeColor: "#21211f",
  // strokeWidth: 1 * SCALE,
  // strokeColor: "blue",

  limbDisposition: 2 * SCALE, // move limbs out form center

  // Rotation
  shoulderAngle: 15,
  elbowAngle: 5,
  hipAngle: 5, //10,
  kneeAngle: 2,
  ankleAngle: 80,
};
