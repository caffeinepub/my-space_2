import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate stars
    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 0.15 + 0.05,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      time += 1;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Deep space background
      const bg = ctx.createRadialGradient(
        w * 0.5,
        h * 0.3,
        0,
        w * 0.5,
        h * 0.3,
        w * 0.8,
      );
      bg.addColorStop(0, "#0B1022");
      bg.addColorStop(1, "#070A14");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Cyan nebula glow (top-right)
      const nebulaC = ctx.createRadialGradient(
        w * 0.75,
        h * 0.2,
        0,
        w * 0.75,
        h * 0.2,
        w * 0.4,
      );
      nebulaC.addColorStop(0, "rgba(29, 108, 120, 0.12)");
      nebulaC.addColorStop(0.5, "rgba(45, 227, 230, 0.04)");
      nebulaC.addColorStop(1, "transparent");
      ctx.fillStyle = nebulaC;
      ctx.fillRect(0, 0, w, h);

      // Violet nebula glow (bottom-left)
      const nebulaV = ctx.createRadialGradient(
        w * 0.15,
        h * 0.8,
        0,
        w * 0.15,
        h * 0.8,
        w * 0.45,
      );
      nebulaV.addColorStop(0, "rgba(90, 50, 160, 0.1)");
      nebulaV.addColorStop(0.5, "rgba(139, 92, 246, 0.04)");
      nebulaV.addColorStop(1, "transparent");
      ctx.fillStyle = nebulaV;
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (const star of stars) {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = h;
          star.x = Math.random() * w;
        }
        const twinkle =
          0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 242, 255, ${star.opacity * twinkle})`;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
