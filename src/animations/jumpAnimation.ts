import { gsap } from "gsap";
import { config } from "../config";
import { deg, rad, rot2D } from "../utils";

export function jumpAnimation(stickFigure: SVGElement) {
  const upperBody = stickFigure.querySelector("#upperBody");

  const leftUpperLeg = stickFigure.querySelector("#leftLegUpper");
  const leftLowerLeg = stickFigure.querySelector("#leftLegLower");
  const leftLegJoint1 = stickFigure.querySelector("#leftLegJoint1");
  const leftLegJoint2 = stickFigure.querySelector("#leftLegJoint2");
  const leftLegJoint3 = stickFigure.querySelector("#leftLegJoint3");

  const rightUpperLeg = stickFigure.querySelector("#rightLegUpper");
  const rightLowerLeg = stickFigure.querySelector("#rightLegLower");
  const rightLegJoint1 = stickFigure.querySelector("#rightLegJoint1");
  const rightLegJoint2 = stickFigure.querySelector("#rightLegJoint2");
  const rightLegJoint3 = stickFigure.querySelector("#rightLegJoint3");

  const tl = gsap.timeline({ yoyo: true, repeat: 1 });

  tl.to(upperBody, {
    y: 20,
    duration: 0.5,
    ease: "power1.inOut",
    onUpdate: () => {
      gsap.set([leftLegJoint1, rightLegJoint1], {
        y: +gsap.getProperty(upperBody, "y"),
      });
    },
  });

  // The ankle joint is the same as the bottom pivot point of the lower leg
  // since the position of this joint is calculated as a superposition of two pendulum-like motions
  // it's offset relative to the hip.
  // If we use the ankle joint as the pivot point for calculations of the knee joint we need to account for this offset.
  tl.to(
    leftUpperLeg,
    {
      y: 20,
      rotation: config.hipAngle + 35,
      scaleY: 0.7,
      duration: 0.5,
      transformOrigin: "top",
      ease: "power1.inOut",
      onUpdate: () => {
        const scale = +gsap.getProperty(leftUpperLeg, "scaleY");
        const alpha = +gsap.getProperty(leftUpperLeg, "rotation");
        const yShift = +gsap.getProperty(leftUpperLeg, "y");

        const shinOffset = {
          x: +gsap.getProperty(leftLegJoint3, "x"),
          y: +gsap.getProperty(leftLegJoint3, "y"),
        };

        const z = Math.sqrt(shinOffset.x ** 2 + shinOffset.y ** 2);
        const theta = Math.atan2(shinOffset.y, -shinOffset.x);
        const thethaStar = rad(90) + theta;

        const b = config.thighLength * scale;
        const c = config.thighLength + config.shinLength - yShift;
        const cDash = Math.sqrt(
          z ** 2 + c ** 2 - 2 * z * c * Math.cos(thethaStar)
        );
        const alphaStar = Math.asin((z * Math.sin(thethaStar)) / cDash);
        const alphaPrime = alpha - deg(alphaStar);
        const aPrime = Math.sqrt(
          b ** 2 + cDash ** 2 - 2 * b * cDash * Math.cos(rad(alphaPrime))
        );
        const betaPrime = Math.asin((b * Math.sin(rad(alphaPrime))) / aPrime);

        const shinScaleY = aPrime / config.shinLength;

        gsap.set(leftLowerLeg, {
          scaleY: shinScaleY,
          rotation: deg(alphaStar - betaPrime),
          transformOrigin: "bottom",
        });

        const originOffset = { x: 0, y: -config.thighLength };
        const rotRes = rot2D({ x: 0, y: b, angle: alpha, originOffset });
        gsap.set(leftLegJoint2, { x: rotRes.x, y: rotRes.y + yShift });
      },
    },
    "<"
  ).to(
    rightUpperLeg,
    {
      y: 20,
      rotation: -config.hipAngle - 35,
      scaleY: 0.7,
      duration: 0.5,
      transformOrigin: "top",
      ease: "power1.inOut",
      onUpdate: () => {
        const scale = +gsap.getProperty(rightUpperLeg, "scaleY");
        const alpha = +gsap.getProperty(rightUpperLeg, "rotation");
        const yShift = +gsap.getProperty(rightUpperLeg, "y");

        const shinOffset = {
          x: +gsap.getProperty(rightLegJoint3, "x"),
          y: +gsap.getProperty(rightLegJoint3, "y"),
        };

        const z = Math.sqrt(shinOffset.x ** 2 + shinOffset.y ** 2);
        const theta = Math.atan2(shinOffset.y, -shinOffset.x);
        const thethaStar = rad(90) + theta;

        const b = config.thighLength * scale;
        const c = config.thighLength + config.shinLength - yShift;
        const cDash = Math.sqrt(
          z ** 2 + c ** 2 - 2 * z * c * Math.cos(thethaStar)
        );
        const alphaStar = Math.asin((z * Math.sin(thethaStar)) / cDash);
        const alphaPrime = alpha - deg(alphaStar);
        const aPrime = Math.sqrt(
          b ** 2 + cDash ** 2 - 2 * b * cDash * Math.cos(rad(alphaPrime))
        );
        const betaPrime = Math.asin((b * Math.sin(rad(alphaPrime))) / aPrime);

        const shinScaleY = aPrime / config.shinLength;

        gsap.set(rightLowerLeg, {
          scaleY: shinScaleY,
          rotation: deg(alphaStar - betaPrime),
          transformOrigin: "bottom",
        });

        const originOffset = { x: 0, y: -config.thighLength };
        const rotRes = rot2D({ x: 0, y: b, angle: alpha, originOffset });
        gsap.set(rightLegJoint2, { x: rotRes.x, y: rotRes.y + yShift });
      },
    },
    "<"
  );

  return tl;
}
