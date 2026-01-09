import { gsap } from "gsap";
import { config } from "./config";
import { pendulum2D, doublePendulum2D } from "./utils";
import { initPosition } from "./drawStickman";
import { getTranslation } from "./i18n";

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
}

// Full-viewport overlay SVG for dragging
let dragOverlay: SVGSVGElement | null = null;

function createDragOverlay(): SVGSVGElement {
  if (dragOverlay) return dragOverlay;

  const NS = "http://www.w3.org/2000/svg";
  dragOverlay = document.createElementNS(NS, "svg") as SVGSVGElement;
  dragOverlay.setAttribute("id", "drag-overlay");
  dragOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(dragOverlay);
  return dragOverlay;
}

function updateOverlayViewBox() {
  if (!dragOverlay) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  dragOverlay.setAttribute("viewBox", `0 0 ${w} ${h}`);
  dragOverlay.setAttribute("width", `${w}`);
  dragOverlay.setAttribute("height", `${h}`);
}

export function initDrag(stickFigure: SVGElement, svgContainer: SVGSVGElement, timeline: gsap.core.Timeline) {
  const head = stickFigure.querySelector("#head") as SVGElement;
  const headFace = stickFigure.querySelector("#headFace") as SVGElement;

  if (!head || !headFace) return;

  // Make head indicate it's draggable
  head.style.cursor = "grab";

  // Create "drag me" tooltip
  const NS = "http://www.w3.org/2000/svg";
  const tooltip = document.createElementNS(NS, "text");
  tooltip.setAttribute("id", "dragTooltip");
  tooltip.setAttribute("x", "100");
  tooltip.setAttribute("y", "20");
  tooltip.setAttribute("text-anchor", "middle");
  tooltip.setAttribute("font-size", "12");
  tooltip.setAttribute("font-family", "JetBrains Mono, monospace");
  tooltip.setAttribute("fill", "#666");
  tooltip.setAttribute("opacity", "0");
  tooltip.setAttribute("pointer-events", "none");
  tooltip.textContent = getTranslation("dragMe");
  stickFigure.appendChild(tooltip);

  // Update tooltip text when language changes
  const updateTooltipText = () => {
    tooltip.textContent = getTranslation("dragMe");
  };

  // Listen for language toggle clicks
  const langToggle = document.querySelector(".lang-toggle");
  langToggle?.addEventListener("click", () => {
    // Small delay to let the language change
    setTimeout(updateTooltipText, 10);
  });

  // Show tooltip on hover
  const showTooltip = () => {
    if (!state.isDragging) {
      gsap.to(tooltip, { opacity: 1, duration: 0.2 });
    }
  };

  const hideTooltip = () => {
    gsap.to(tooltip, { opacity: 0, duration: 0.2 });
  };

  head.addEventListener("mouseenter", showTooltip);
  head.addEventListener("mouseleave", hideTooltip);

  const state: DragState = {
    isDragging: false,
    startX: 0,
    startY: 0,
  };

  // Track current stickman position in viewport coordinates
  let viewportX = 0;
  let viewportY = 0;

  // Store original SVG rect for returning
  let originalRect: DOMRect | null = null;

  // Get mouse position in viewport coordinates
  function getViewportMousePosition(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;
    return { x: clientX, y: clientY };
  }

  // Convert original SVG position to viewport coordinates
  function svgToViewport(svgX: number, svgY: number): { x: number; y: number } {
    const rect = svgContainer.getBoundingClientRect();
    const viewBox = svgContainer.viewBox.baseVal;
    const svgWidth = viewBox.width || 200;
    const svgHeight = viewBox.height || 300;

    const scaleX = rect.width / svgWidth;
    const scaleY = rect.height / svgHeight;

    return {
      x: rect.left + svgX * scaleX,
      y: rect.top + svgY * scaleY,
    };
  }

  function setHangingPose(stickFigure: SVGElement) {
    // Relaxed dangling pose - like being held by the head
    // Arms hang down close to the body
    const rightArmAngle = 8;
    const leftArmAngle = 10;
    const rightElbowBend = 5;
    const leftElbowBend = 3;

    // Right arm - hangs down and slightly back
    gsap.to(stickFigure.querySelector("#rightArmUpper"), {
      rotation: rightArmAngle,
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#rightArmLower"), {
      rotation: rightElbowBend,
      ...pendulum2D(config.upperArmLength, rightArmAngle),
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#rightArmJoint2"), {
      ...pendulum2D(config.upperArmLength, rightArmAngle),
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });

    // Left arm - hangs down slightly different for asymmetry
    gsap.to(stickFigure.querySelector("#leftArmUpper"), {
      rotation: -leftArmAngle,
      transformOrigin: "top right",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#leftArmLower"), {
      rotation: -leftElbowBend,
      ...pendulum2D(config.upperArmLength, -leftArmAngle),
      transformOrigin: "top right",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#leftArmJoint2"), {
      ...pendulum2D(config.upperArmLength, -leftArmAngle),
      transformOrigin: "top right",
      duration: 0.3,
      ease: "power2.out",
    });

    // Legs hang straight down (not crossing!)
    // Both legs go in similar direction - slight swing forward
    const rightLegAngle = -3; // Slight angle, same direction
    const leftLegAngle = 2; // Very slight opposite to avoid overlap
    const rightKneeBend = -8; // Knees bent slightly backward (natural dangle)
    const leftKneeBend = 5;

    // Right leg
    gsap.to(stickFigure.querySelector("#rightLegUpper"), {
      rotation: rightLegAngle,
      y: 0,
      scaleY: 1,
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#rightLegLower"), {
      rotation: rightKneeBend,
      scaleY: 1,
      ...pendulum2D(config.thighLength, rightLegAngle),
      transformOrigin: "top right",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#rightLegJoint1"), {
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#rightLegJoint2"), {
      ...pendulum2D(config.thighLength, rightLegAngle),
      y: 0,
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#rightLegJoint3"), {
      ...doublePendulum2D(config.thighLength, config.shinLength, rightLegAngle, rightKneeBend),
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#rightFoot"), {
      rotation: 50, // Foot points more downward when dangling
      ...doublePendulum2D(config.thighLength, config.shinLength, rightLegAngle, rightKneeBend),
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });

    // Left leg
    gsap.to(stickFigure.querySelector("#leftLegUpper"), {
      rotation: leftLegAngle,
      y: 0,
      scaleY: 1,
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#leftLegLower"), {
      rotation: leftKneeBend,
      scaleY: 1,
      ...pendulum2D(config.thighLength, leftLegAngle),
      transformOrigin: "top right",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#leftLegJoint1"), {
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#leftLegJoint2"), {
      ...pendulum2D(config.thighLength, leftLegAngle),
      y: 0,
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#leftLegJoint3"), {
      ...doublePendulum2D(config.thighLength, config.shinLength, leftLegAngle, leftKneeBend),
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#leftFoot"), {
      rotation: -60, // Foot points more downward when dangling
      ...doublePendulum2D(config.thighLength, config.shinLength, leftLegAngle, leftKneeBend),
      transformOrigin: "top left",
      duration: 0.3,
      ease: "power2.out",
    });

    // Reset upper body rotation and head
    gsap.to(stickFigure.querySelector("#upperBody"), {
      rotation: 0,
      y: 0,
      transformOrigin: "bottom",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(stickFigure.querySelector("#head"), {
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      transformOrigin: "bottom",
      duration: 0.3,
      ease: "power2.out",
    });
  }

  function onDragStart(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    state.isDragging = true;
    head.style.cursor = "grabbing";

    // Hide the tooltip
    hideTooltip();

    // Store original SVG position
    originalRect = svgContainer.getBoundingClientRect();

    // Get stickman's initial position in viewport coordinates
    // Head is at SVG coordinates (100, 32)
    const headViewportPos = svgToViewport(100, 32);

    // Create/update the full-viewport overlay
    const overlay = createDragOverlay();
    updateOverlayViewBox();

    // Calculate the scale factor between original SVG and overlay
    const viewBox = svgContainer.viewBox.baseVal;
    const svgWidth = viewBox.width || 200;
    const svgHeight = viewBox.height || 300;
    const scale = Math.min(originalRect.width / svgWidth, originalRect.height / svgHeight);

    // Move stickman to overlay and position it correctly
    overlay.appendChild(stickFigure);

    // Remove tooltip from stickman (it will look weird at different positions)
    const tooltipInFigure = stickFigure.querySelector("#dragTooltip");
    if (tooltipInFigure) {
      tooltipInFigure.setAttribute("opacity", "0");
    }

    // Apply scale transform and position to match original visual position
    gsap.set(stickFigure, {
      x: headViewportPos.x - 100 * scale,
      y: headViewportPos.y - 32 * scale,
      scale: scale,
      transformOrigin: "0 0",
    });

    // Track where mouse grabbed relative to stickman position
    const mousePos = getViewportMousePosition(event);
    state.startX = mousePos.x - headViewportPos.x;
    state.startY = mousePos.y - headViewportPos.y;

    viewportX = headViewportPos.x;
    viewportY = headViewportPos.y;

    // Pause the animation timeline
    timeline.pause();

    // Set the hanging pose
    setHangingPose(stickFigure);

    // Add global listeners
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchmove", onDragMove, { passive: false });
    document.addEventListener("touchend", onDragEnd);
  }

  function onDragMove(event: MouseEvent | TouchEvent) {
    if (!state.isDragging) return;
    event.preventDefault();

    const mousePos = getViewportMousePosition(event);

    // Calculate new head position
    viewportX = mousePos.x - state.startX;
    viewportY = mousePos.y - state.startY;

    // Get scale factor
    const viewBox = svgContainer.viewBox.baseVal;
    const svgWidth = viewBox.width || 200;
    const svgHeight = viewBox.height || 300;
    const rect = originalRect || svgContainer.getBoundingClientRect();
    const scale = Math.min(rect.width / svgWidth, rect.height / svgHeight);

    // Stickman dimensions for bounds checking
    const stickmanWidth = (config.headRadius * 2 + 40) * scale;

    // Soft bounds - allow going slightly off-screen but keep some visibility
    const minX = -50;
    const maxX = window.innerWidth + 50 - stickmanWidth;
    const minY = config.headRadius * scale;
    const maxY = window.innerHeight - 50;

    // Clamp to keep stickman mostly visible
    viewportX = Math.max(minX, Math.min(maxX, viewportX));
    viewportY = Math.max(minY, Math.min(maxY, viewportY));

    // Apply transform
    gsap.set(stickFigure, {
      x: viewportX - 100 * scale,
      y: viewportY - 32 * scale,
      scale: scale,
      transformOrigin: "0 0",
    });
  }

  function onDragEnd() {
    state.isDragging = false;
    head.style.cursor = "grab";

    // Remove global listeners
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("touchmove", onDragMove);
    document.removeEventListener("touchend", onDragEnd);

    // Get current position and target position
    const rect = svgContainer.getBoundingClientRect();
    const viewBox = svgContainer.viewBox.baseVal;
    const svgWidth = viewBox.width || 200;
    const svgHeight = viewBox.height || 300;
    const scale = Math.min(rect.width / svgWidth, rect.height / svgHeight);

    // Target position (head at 100, 32 in SVG coordinates)
    const targetX = rect.left + 100 * scale - 100 * scale;
    const targetY = rect.top + 32 * scale - 32 * scale;

    // Animate stickman back to original position
    gsap.to(stickFigure, {
      x: targetX,
      y: targetY,
      scale: scale,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        // Move stickman back to original container
        svgContainer.appendChild(stickFigure);

        // Reset transforms
        gsap.set(stickFigure, {
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: "0 0",
        });

        // Reset tracking
        viewportX = 0;
        viewportY = 0;
        originalRect = null;

        // Reset pose to initial position
        initPosition(stickFigure);

        // Restart the animation from the beginning
        timeline.restart();
      },
    });
  }

  // Add event listeners to head
  head.addEventListener("mousedown", onDragStart);
  head.addEventListener("touchstart", onDragStart, { passive: false });

  // Return cleanup function if needed
  return () => {
    head.removeEventListener("mousedown", onDragStart);
    head.removeEventListener("touchstart", onDragStart);
    head.removeEventListener("mouseenter", showTooltip);
    head.removeEventListener("mouseleave", hideTooltip);
    tooltip.remove();
  };
}
