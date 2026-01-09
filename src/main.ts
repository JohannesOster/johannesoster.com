import "./index.css";
import { drawStickman, initPosition } from "./drawStickman";
import { waveAnimation } from "./animations";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { jumpAnimation } from "./animations/jumpAnimation";
import { initI18n } from "./i18n";
// import { drawGeomtryHelper, initPosition } from "./geometryHelper";

const CONTAINER_ID = "stickman-container";

gsap.registerPlugin(DrawSVGPlugin);

const svgElement = document.getElementById(CONTAINER_ID);
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

// Initialize language switcher
initI18n();
