// Animated grain effect for glassmorphic background
// Grains stick to glass edge and bounce off as tone plays
import React, { useRef, useEffect } from "react";

const GRAINS = 1000;
const EDGE_RADIUS = 270; // px, matches glass card
const GLASS_CENTER = { x: 310, y: 260 };

function randomAngle() {
  return Math.random() * 2 * Math.PI;
}

function randomRadius() {
  return EDGE_RADIUS + Math.random() * 8 - 4;
}

export default function GrainEffect({ isPlaying }) {
  const canvasRef = useRef();
  const grains = useRef(
    Array.from({ length: GRAINS }, () => {
      const angle = randomAngle();
      return {
        angle,
        radius: randomRadius(),
        speed: 0.5 + Math.random() * 1.5,
        bounce: false,
      };
    })
  );

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    let frame;
    function draw() {
      ctx.clearRect(0, 0, 620, 520);
      for (let g of grains.current) {
        // Animate bounce if playing
        if (isPlaying && !g.bounce) {
          g.radius += 8 + Math.random() * 8;
          g.bounce = true;
        } else if (!isPlaying && g.bounce) {
          g.radius = randomRadius();
          g.bounce = false;
        }
        // Animate grain
        g.angle += (Math.random() - 0.5) * 0.01;
        ctx.beginPath();
        ctx.arc(
          GLASS_CENTER.x + g.radius * Math.cos(g.angle),
          GLASS_CENTER.y + g.radius * Math.sin(g.angle),
          1.2,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = isPlaying ? "#4CAF50" : "#bbb";
        ctx.globalAlpha = 0.7;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={620}
      height={520}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
