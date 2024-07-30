import { gsap } from "gsap";
import { config } from "./config";
import { deg, doublePendulum2D, pendulum2D, rad } from "./utils";

// Helper function to calculate end point
const calcEndPoint = (startX: number, startY: number, length: number) => ({
  x: startX,
  y: startY + length,
});

const NS = "http://www.w3.org/2000/svg";
const A = { x: 100, y: 100 };
const C = calcEndPoint(A.x, A.y, config.thighLength);
const B = calcEndPoint(C.x, C.y, config.shinLength);

export const drawGeomtryHelper = (_x: number, _y: number) => {
  // Create group for the stick figure
  const group = document.createElementNS(NS, "g");
  group.setAttribute("id", config.id);

  const b = document.createElementNS(NS, "line");
  b.setAttribute("id", "b");
  b.setAttribute("x1", `${A.x}`);
  b.setAttribute("y1", `${A.y}`);
  b.setAttribute("x2", `${C.x}`);
  b.setAttribute("y2", `${C.y}`);
  b.setAttribute("stroke", config.strokeColor);
  b.setAttribute("stroke-width", `${config.strokeWidth}`);

  const c = document.createElementNS(NS, "line");
  c.setAttribute("id", "c");
  c.setAttribute("x1", `${A.x}`);
  c.setAttribute("y1", `${A.y}`);
  c.setAttribute("x2", `${B.x}`);
  c.setAttribute("y2", `${B.y}`);
  c.setAttribute("stroke", config.strokeColor);
  c.setAttribute("stroke-width", `${config.strokeWidth}`);

  const CPrime = pendulum2D(config.thighLength, config.hipAngle);
  CPrime.x += C.x;
  CPrime.y += C.y;
  const a = document.createElementNS(NS, "line");
  a.setAttribute("id", "a");
  a.setAttribute("x1", `${CPrime.x}`);
  a.setAttribute("y1", `${CPrime.y}`);
  a.setAttribute("x2", `${B.x}`);
  a.setAttribute("y2", `${B.y}`);
  a.setAttribute("stroke", config.strokeColor);
  a.setAttribute("stroke-width", `${config.strokeWidth}`);

  group.appendChild(a);
  group.appendChild(b);
  group.appendChild(c);

  const aPrime = document.createElementNS(NS, "line");
  aPrime.setAttribute("id", "aPrime");
  aPrime.setAttribute("x1", `${C.x}`);
  aPrime.setAttribute("y1", `${C.y}`);
  aPrime.setAttribute("x2", `${B.x}`);
  aPrime.setAttribute("y2", `${B.y}`);
  aPrime.setAttribute("stroke", "darkgreen");
  aPrime.setAttribute("stroke-width", `${config.strokeWidth}`);
  group.appendChild(aPrime);

  const BPrimeShift = doublePendulum2D(
    config.thighLength,
    config.shinLength,
    config.hipAngle,
    config.kneeAngle
  );
  const delX = document.createElementNS(NS, "line");
  delX.setAttribute("id", "delX");
  delX.setAttribute("x1", `${B.x}`);
  delX.setAttribute("y1", `${B.y}`);
  delX.setAttribute("x2", `${B.x + BPrimeShift.x}`);
  delX.setAttribute("y2", `${B.y}`);
  delX.setAttribute("stroke", "lightgreen");
  delX.setAttribute("stroke-width", `${config.strokeWidth}`);
  group.appendChild(delX);
  const delY = document.createElementNS(NS, "line");
  delY.setAttribute("id", "delY");
  delY.setAttribute("x1", `${B.x + BPrimeShift.x}`);
  delY.setAttribute("y1", `${B.y}`);
  delY.setAttribute("x2", `${B.x + BPrimeShift.x}`);
  delY.setAttribute("y2", `${B.y + BPrimeShift.y}`);
  delY.setAttribute("stroke", "lightgreen");
  delY.setAttribute("stroke-width", `${config.strokeWidth}`);
  group.appendChild(delY);

  const z = document.createElementNS(NS, "line");
  z.setAttribute("id", "z");
  z.setAttribute("x1", `${B.x}`);
  z.setAttribute("y1", `${B.y}`);
  z.setAttribute("x2", `${B.x + BPrimeShift.x}`);
  z.setAttribute("y2", `${B.y + BPrimeShift.y}`);
  z.setAttribute("stroke", "lightgreen");
  z.setAttribute("stroke-width", `${config.strokeWidth}`);
  group.appendChild(z);

  const cPrime = document.createElementNS(NS, "line");
  cPrime.setAttribute("id", "cPrime");
  cPrime.setAttribute("x1", `${B.x + BPrimeShift.x}`);
  cPrime.setAttribute("y1", `${B.y + BPrimeShift.y}`);
  cPrime.setAttribute("x2", `${A.x}`);
  cPrime.setAttribute("y2", `${A.y}`);
  cPrime.setAttribute("stroke", "darkgreen");
  cPrime.setAttribute("stroke-width", `${config.strokeWidth}`);
  group.appendChild(cPrime);

  const marker = document.createElementNS(NS, "line");
  marker.setAttribute("id", "marker");
  marker.setAttribute("x1", `${C.x}`);
  marker.setAttribute("y1", `${C.y}`);
  marker.setAttribute("x2", `${B.x}`);
  marker.setAttribute("y2", `${B.y}`);
  marker.setAttribute("stroke", "red");
  marker.setAttribute("stroke-width", `${config.strokeWidth}`);
  group.appendChild(marker);

  const marker2 = document.createElementNS(NS, "line");
  marker2.setAttribute("id", "marker2");
  marker2.setAttribute("x1", `${A.x}`);
  marker2.setAttribute("y1", `${A.y}`);
  marker2.setAttribute("x2", `${B.x}`);
  marker2.setAttribute("y2", `${B.y - 30}`);
  marker2.setAttribute("stroke", "red");
  marker2.setAttribute("stroke-width", `${config.strokeWidth}`);
  group.appendChild(marker2);

  const marker3Shift = doublePendulum2D(
    config.thighLength,
    config.shinLength,
    config.hipAngle,
    config.kneeAngle
  );
  const marker3 = document.createElementNS(NS, "line");
  marker3.setAttribute("id", "marker3");
  marker3.setAttribute("x1", `${C.x + marker3Shift.x}`);
  marker3.setAttribute("y1", `${C.y + marker3Shift.y}`);
  marker3.setAttribute("x2", `${B.x + marker3Shift.x}`);
  marker3.setAttribute("y2", `${B.y + marker3Shift.y}`);
  marker3.setAttribute("stroke", "red");
  marker3.setAttribute("stroke-width", `${config.strokeWidth}`);
  group.appendChild(marker3);

  return group;
};

export const initPosition = (g: SVGElement) => {
  gsap.set(g.querySelector("#b"), {
    rotation: config.hipAngle,
    transformOrigin: "top left",
  });
  gsap.set(g.querySelector("#aPrime"), {
    rotation: config.kneeAngle,
    ...pendulum2D(config.thighLength, config.hipAngle),
    transformOrigin: "top right",
  });

  const { x: delX, y: delY } = doublePendulum2D(
    config.thighLength,
    config.shinLength,
    config.hipAngle,
    config.kneeAngle
  );

  // imaginary triangle of lower leg with shifted position
  const z = Math.sqrt(delX ** 2 + delY ** 2);
  const theta = Math.atan2(delY, -delX);
  const thethaStar = rad(90) + theta;

  gsap.set(g.querySelector("#marker"), {
    rotation: -deg(thethaStar),
    transformOrigin: "bottom",
  });

  const b = config.thighLength;
  const c = config.thighLength + config.shinLength;
  const cDash = Math.sqrt(z ** 2 + c ** 2 - 2 * z * c * Math.cos(thethaStar));
  const alphaStar = Math.asin((z * Math.sin(thethaStar)) / cDash);

  gsap.set(g.querySelector("#marker2"), {
    rotation: deg(alphaStar),
  });

  const alphaPrime = config.hipAngle - deg(alphaStar);
  const aPrime = Math.sqrt(
    b ** 2 + cDash ** 2 - 2 * b * cDash * Math.cos(rad(alphaPrime))
  );
  const betaPrime = Math.asin((b * Math.sin(rad(alphaPrime))) / aPrime);

  gsap.set(g.querySelector("#marker3"), {
    rotation: deg(alphaStar - betaPrime),
    transformOrigin: "bottom",
  });
};
