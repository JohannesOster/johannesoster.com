import { gsap } from "gsap";
import { config } from "./config";
import { dx, dy } from "./utils";

export const drawStickman = (x: number, y: number) => {
  const NS = "http://www.w3.org/2000/svg";

  // Create group for the stick figure
  const group = document.createElementNS(NS, "g");
  group.setAttribute("id", config.id);

  // Helper function to calculate end point
  const calcEndPoint = (startX: number, startY: number, length: number) => ({
    x: startX,
    y: startY + length,
  });

  // Create head
  const head = document.createElementNS(NS, "circle");
  head.setAttribute("id", "head");
  head.setAttribute("cx", `${x}`);
  head.setAttribute("cy", `${y + config.headRadius}`);
  head.setAttribute("r", `${config.headRadius}`);
  head.setAttribute("fill", "none");
  head.setAttribute("stroke", config.strokeColor);
  head.setAttribute("stroke-width", `${config.strokeWidth}`);

  // Create body
  const body = document.createElementNS(NS, "line");
  body.setAttribute("id", "body");
  body.setAttribute("x1", `${x}`);
  body.setAttribute("y1", `${y + 2 * config.headRadius}`);
  body.setAttribute("x2", `${x}`);
  body.setAttribute("y2", `${y + 2 * config.headRadius + config.bodyLength}`);
  body.setAttribute("stroke", config.strokeColor);
  body.setAttribute("stroke-width", `${1.5 * config.strokeWidth}`);

  // Function to create a limb (arm or leg)
  type LimbOpts = {
    id: string;
    startX: number;
    startY: number;
    upperLength: number;
    lowerLength: number;
    jointRadius: number;
    includeAnkle?: boolean;
  };
  function createLimb({
    id,
    startX,
    startY,
    upperLength,
    lowerLength,
    jointRadius,
    includeAnkle = false,
  }: LimbOpts) {
    const limb = document.createElementNS(NS, "g");
    limb.setAttribute("id", id);

    const joint1 = { x: startX, y: startY };
    const joint2 = calcEndPoint(joint1.x, joint1.y, upperLength);
    const joint3 = calcEndPoint(joint2.x, joint2.y, lowerLength);

    const upper = document.createElementNS(NS, "line");
    upper.setAttribute("id", `${id}Upper`);
    upper.setAttribute("x1", `${joint1.x}`);
    upper.setAttribute("y1", `${joint1.y}`);
    upper.setAttribute("x2", `${joint2.x}`);
    upper.setAttribute("y2", `${joint2.y}`);
    upper.setAttribute("stroke", config.strokeColor);
    upper.setAttribute("stroke-width", `${config.strokeWidth}`);

    const lower = document.createElementNS(NS, "line");
    lower.setAttribute("id", `${id}Lower`);
    lower.setAttribute("x1", `${joint2.x}`);
    lower.setAttribute("y1", `${joint2.y}`);
    lower.setAttribute("x2", `${joint3.x}`);
    lower.setAttribute("y2", `${joint3.y}`);
    lower.setAttribute("stroke", config.strokeColor);
    lower.setAttribute("stroke-width", `${config.strokeWidth}`);

    const joint1Circle = document.createElementNS(NS, "circle");
    joint1Circle.setAttribute("id", `${id}Joint1`);
    joint1Circle.setAttribute("cx", `${joint1.x}`);
    joint1Circle.setAttribute("cy", `${joint1.y}`);
    joint1Circle.setAttribute("r", `${jointRadius}`);
    joint1Circle.setAttribute("fill", config.strokeColor);

    const joint2Circle = document.createElementNS(NS, "circle");
    joint2Circle.setAttribute("id", `${id}Joint2`);
    joint2Circle.setAttribute("cx", `${joint2.x}`);
    joint2Circle.setAttribute("cy", `${joint2.y}`);
    joint2Circle.setAttribute("r", `${jointRadius}`);
    joint2Circle.setAttribute("fill", config.strokeColor);

    limb.appendChild(upper);
    limb.appendChild(lower);
    limb.appendChild(joint1Circle);
    limb.appendChild(joint2Circle);

    if (includeAnkle) {
      const joint3Circle = document.createElementNS(NS, "circle");
      joint3Circle.setAttribute("id", `${id}Joint3`);
      joint3Circle.setAttribute("cx", `${joint3.x}`);
      joint3Circle.setAttribute("cy", `${joint3.y}`);
      joint3Circle.setAttribute("r", `${jointRadius}`);
      joint3Circle.setAttribute("fill", config.strokeColor);
      limb.appendChild(joint3Circle);
    }

    return { limb, endPoint: joint3 };
  }

  // Create arms
  const rightArm = createLimb({
    id: "rightArm",
    startX: x + config.limbDisposition,
    startY: y + config.headRadius * 2 + config.neckLength,
    upperLength: config.upperArmLength,
    lowerLength: config.forearmLength,
    jointRadius: config.jointRadius,
  });
  const leftArm = createLimb({
    id: "leftArm",
    startX: x - config.limbDisposition,
    startY: y + config.headRadius * 2 + config.neckLength,
    upperLength: config.upperArmLength,
    lowerLength: config.forearmLength,
    jointRadius: config.jointRadius,
  });

  // Create legs
  const rightLeg = createLimb({
    id: "rightLeg",
    startX: x + config.limbDisposition,
    startY: y + config.headRadius * 2 + config.bodyLength,
    upperLength: config.thighLength,
    lowerLength: config.shinLength,
    jointRadius: config.jointRadius,
    includeAnkle: true,
  });
  const leftLeg = createLimb({
    id: "leftLeg",
    startX: x - config.limbDisposition,
    startY: y + config.headRadius * 2 + config.bodyLength,
    upperLength: config.thighLength,
    lowerLength: config.shinLength,
    jointRadius: config.jointRadius,
    includeAnkle: true,
  });

  // Add feet
  type FootOpts = {
    id: string;
    startX: number;
    startY: number;
    length: number;
  };
  function createFoot({ id, startX, startY, length }: FootOpts) {
    const foot = document.createElementNS(NS, "line");
    foot.setAttribute("id", id);
    foot.setAttribute("x1", `${startX}`);
    foot.setAttribute("y1", `${startY}`);
    const endPoint = calcEndPoint(startX, startY, length);
    foot.setAttribute("x2", `${endPoint.x}`);
    foot.setAttribute("y2", `${endPoint.y}`);
    foot.setAttribute("stroke", config.strokeColor);
    foot.setAttribute("stroke-width", `${1.5 * config.strokeWidth}`);
    return foot;
  }

  const rightFoot = createFoot({
    id: "rightFoot",
    startX: rightLeg.endPoint.x,
    startY: rightLeg.endPoint.y - config.footYOffset,
    length: config.footLength,
  });
  const leftFoot = createFoot({
    id: "leftFoot",
    startX: leftLeg.endPoint.x,
    startY: leftLeg.endPoint.y - config.footYOffset,
    length: config.footLength,
  });

  rightLeg.limb.appendChild(rightFoot);
  leftLeg.limb.appendChild(leftFoot);

  const upperBodyGroup = document.createElementNS(NS, "g");
  upperBodyGroup.setAttribute("id", "upperBody");
  upperBodyGroup.appendChild(body);
  upperBodyGroup.appendChild(head);
  upperBodyGroup.appendChild(rightArm.limb);
  upperBodyGroup.appendChild(leftArm.limb);
  group.appendChild(upperBodyGroup);

  group.appendChild(rightLeg.limb);
  group.appendChild(leftLeg.limb);

  return group;
};

export const initPosition = (g: SVGElement) => {
  // Arms
  gsap.set(g.querySelector("#rightArmUpper"), {
    rotation: -config.shoulderAngle,
    transformOrigin: "top left",
  });
  // technically cos is a symetric function so one could leave the minus sign out
  // but I think it's clearer this way
  gsap.set(g.querySelector("#rightArmLower"), {
    rotation: config.elbowAngle,
    x: dx(config.upperArmLength, -config.shoulderAngle),
    y: dy(config.upperArmLength, -config.shoulderAngle),
    transformOrigin: "top left",
  });
  gsap.set(g.querySelector("#rightArmJoint2"), {
    x: dx(config.upperArmLength, -config.shoulderAngle),
    y: dy(config.upperArmLength, -config.shoulderAngle),
    transformOrigin: "top left",
  });

  gsap.set(g.querySelector("#leftArmUpper"), {
    rotation: config.shoulderAngle,
    transformOrigin: "top right",
  });
  gsap.set(g.querySelector("#leftArmLower"), {
    rotation: -config.elbowAngle,
    x: dx(config.upperArmLength, config.shoulderAngle),
    y: dy(config.upperArmLength, config.shoulderAngle),
    transformOrigin: "top right",
  });
  gsap.set(g.querySelector("#leftArmJoint2"), {
    x: dx(config.upperArmLength, config.shoulderAngle),
    y: dy(config.upperArmLength, config.shoulderAngle),
    transformOrigin: "top right",
  });

  // Legs
  gsap.set(g.querySelector("#rightLegUpper"), {
    rotation: -config.hipAngle,
    transformOrigin: "top left",
  });
  gsap.set(g.querySelector("#rightLegLower"), {
    rotation: -config.kneeAngle,
    x: dx(config.thighLength, -config.hipAngle),
    y: dy(config.thighLength, -config.hipAngle),
    transformOrigin: "top right",
  });
  gsap.set(g.querySelector("#rightLegJoint2"), {
    x: dx(config.thighLength, -config.hipAngle),
    y: dy(config.thighLength, -config.hipAngle),
    transformOrigin: "top left",
  });
  gsap.set(g.querySelector("#rightLegJoint3"), {
    x:
      dx(config.thighLength, -config.hipAngle) +
      dx(config.shinLength, -config.kneeAngle),
    y:
      dy(config.thighLength, -config.hipAngle) +
      dy(config.shinLength, -config.kneeAngle),
    transformOrigin: "top left",
  });
  gsap.set(g.querySelector("#rightFoot"), {
    rotation: -config.ankleAngle,
    x:
      dx(config.thighLength, -config.hipAngle) +
      dx(config.shinLength, -config.kneeAngle),
    y:
      dy(config.thighLength, -config.hipAngle) +
      dy(config.shinLength, -config.kneeAngle),
    transformOrigin: "top left",
  });

  gsap.set(g.querySelector("#leftLegUpper"), {
    rotation: config.hipAngle,
    transformOrigin: "top left",
  });
  gsap.set(g.querySelector("#leftLegLower"), {
    rotation: config.kneeAngle,
    x: dx(config.thighLength, config.hipAngle),
    y: dy(config.thighLength, config.hipAngle),
    transformOrigin: "top right",
  });
  gsap.set(g.querySelector("#leftLegJoint2"), {
    x: dx(config.thighLength, config.hipAngle),
    y: dy(config.thighLength, config.hipAngle),
    transformOrigin: "top left",
  });
  gsap.set(g.querySelector("#leftLegJoint3"), {
    x:
      dx(config.thighLength, config.hipAngle) +
      dx(config.shinLength, config.kneeAngle),
    y:
      dy(config.thighLength, config.hipAngle) +
      dy(config.shinLength, config.kneeAngle),
    transformOrigin: "top left",
  });
  gsap.set(g.querySelector("#leftFoot"), {
    rotation: config.ankleAngle,
    x:
      dx(config.thighLength, config.hipAngle) +
      dx(config.shinLength, config.kneeAngle),
    y:
      dy(config.thighLength, config.hipAngle) +
      dy(config.shinLength, config.kneeAngle),
    transformOrigin: "top left",
  });
};
