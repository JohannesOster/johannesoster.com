import "./index.css";
import { drawStickman, initPosition } from "./drawStickman";
import { waveAnimation } from "./animations";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { jumpAnimation } from "./animations/jumpAnimation";
import { initI18n } from "./i18n";
import { initDrag } from "./dragStickman";
// import { drawGeomtryHelper, initPosition } from "./geometryHelper";

// Easter egg for curious developers 👀
console.log(
  `%c
    O/
   /|    Hey there, curious human being! 👋✨
   / \\
  `,
  "color: #00ff88; font-family: monospace; font-size: 12px; line-height: 1.5;"
);

const CONTAINER_ID = "stickman-container";

gsap.registerPlugin(DrawSVGPlugin);

const svgElement = document.getElementById(CONTAINER_ID) as SVGSVGElement | null;
// const g = drawGeomtryHelper(100, 32);
// svgElement?.appendChild(g);
// initPosition(g);
const g = drawStickman(100, 32);
svgElement?.appendChild(g);
initPosition(g);

const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
tl.add(waveAnimation(g));
tl.add(jumpAnimation(g));
tl.play();

// Initialize drag functionality - drag stickman by its head
if (svgElement) {
  initDrag(g, svgElement, tl);
}

// Initialize language switcher
initI18n();
