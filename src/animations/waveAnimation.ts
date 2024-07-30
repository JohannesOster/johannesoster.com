import { gsap } from "gsap";
import { config } from "../config";
import { dx, dy } from "../utils";

export function waveAnimation(stickFigure: SVGElement) {
  const head = stickFigure.querySelector("#head");
  const upperBody = stickFigure.querySelector("#upperBody");

  const leftUpperArm = stickFigure.querySelector("#leftArmUpper");
  const leftLowerArm = stickFigure.querySelector("#leftArmLower");
  const leftArmJoint2 = stickFigure.querySelector("#leftArmJoint2");

  const rightUpperArm = stickFigure.querySelector("#rightArmUpper");
  const rightLowerArm = stickFigure.querySelector("#rightArmLower");
  const rightArmJoint2 = stickFigure.querySelector("#rightArmJoint2");

  const tl = gsap.timeline({ yoyo: true, repeat: 1 });

  // Bend body to the left and rotate head slightly
  tl.to(
    upperBody,
    {
      rotation: -10,
      transformOrigin: "bottom",
      duration: 0.5,
      ease: "power1.inOut",
    },
    0
  ).to(
    head,
    {
      rotation: 8,
      transformOrigin: "bottom",
      duration: 0.4,
      delay: 0.1,
      ease: "power1.inOut",
    },
    0
  );

  // Loosen left arm a bit
  tl.to(
    leftUpperArm,
    {
      rotation: 0.5 * config.shoulderAngle,
      transformOrigin: "top right",
      duration: 0.5,
      ease: "power1.inOut",
      onUpdate: function () {
        const rotation = +gsap.getProperty(leftUpperArm, "rotation");
        const x = dx(config.upperArmLength, rotation);
        const y = dy(config.upperArmLength, rotation);
        gsap.set(leftLowerArm, { x, y });
        gsap.set(leftArmJoint2, { x, y });
      },
    },
    0
  ).to(
    leftLowerArm,
    {
      rotation: 5,
      transformOrigin: "top right",
      duration: 0.5,
      delay: 0.05,
      ease: "power1.inOut",
    },
    0
  );

  // Move rigth arm up
  tl.to(
    rightUpperArm,
    {
      rotation: -80,
      transformOrigin: "top left",
      duration: 0.5,
      ease: "power3.inOut",
      onUpdate: function () {
        const rotation = +gsap.getProperty(rightUpperArm, "rotation");
        const x = dx(config.upperArmLength, rotation);
        const y = dy(config.upperArmLength, rotation);
        gsap.set(rightLowerArm, { x, y });
        gsap.set(rightArmJoint2, { x, y });
      },
    },
    0
  ).to(
    rightLowerArm,
    {
      rotation: -145,
      transformOrigin: "top left",
      duration: 0.5,
      ease: "power2.in",
    },
    0
  );

  tl.to(
    rightLowerArm,
    {
      rotation: -200,
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    },
    "=-0.05"
  );

  tl.to(rightLowerArm, {
    rotation: -145,
    repeat: 2,
    yoyo: true,
    transformOrigin: "top left",
    duration: 0.5,
    ease: "power1.inOut",
  }).to(
    head,
    {
      rotation: 6,
      transformOrigin: "bottom",
      duration: 0.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 2,
    },
    "<"
  );

  tl.to(
    head,
    {
      scaleY: 1.01,
      scaleX: 0.999,
      transformOrigin: "bottom",
      duration: 0.275,
      yoyo: true,
      repeat: 5, // To match the number of waves
      ease: "power1.inOut",
    },
    "<-0.25"
  );

  return tl;
}
