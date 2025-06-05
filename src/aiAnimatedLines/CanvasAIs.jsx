// CanvasAI.jsx
import React, { useRef, useEffect } from "react";

const CanvasAI = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    const pointCount = 50;
    const maxDistance = 150;
    let points = [];

    const random = (min, max) => Math.random() * (max - min) + min;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-1, 1);
        this.vy = random(-1, 1);
        this.radius = 2 + Math.random() * 2;
      }

      move() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
        ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
        ctx.shadowBlur = 8;
        ctx.fill();
      }
    }

    const initPoints = () => {
      points = [];
      for (let i = 0; i < pointCount; i++) {
        points.push(new Point(random(0, width), random(0, height)));
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < pointCount; i++) {
        for (let j = i + 1; j < pointCount; j++) {
          const p1 = points[i];
          const p2 = points[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < maxDistance) {
            const opacity = 1 - dist / maxDistance;
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.shadowColor = "rgba(0, 255, 255, 0.6)";
            ctx.shadowBlur = 5;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      points.forEach((p) => {
        p.move();
        p.draw();
      });

      drawConnections();

      requestAnimationFrame(animate);
    };

    resize();
    initPoints();
    animate();

    window.addEventListener("resize", () => {
      resize();
      initPoints();
    });

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
    />
  );
};

export default CanvasAI;
