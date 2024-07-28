import "./index.css";
import { drawStickman, initPosition } from "./drawStickman";
import { waveAnimation } from "./animations";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

const CONTAINER_ID = "stickman-container";

gsap.registerPlugin(DrawSVGPlugin);

const svgElement = document.getElementById(CONTAINER_ID);
const g = drawStickman(100, 32);
svgElement?.appendChild(g);
initPosition(g);

const waveTimeline = waveAnimation(g);
waveTimeline.play();
