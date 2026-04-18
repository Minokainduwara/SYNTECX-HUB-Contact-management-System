import { useEffect, useRef } from "react";

// ─── Petal shape points (pre-computed unit petal) ───────────────────────────
function buildPetalPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  // Draw a realistic 5-petal sakura flower
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const petalAngle = Math.PI / 5;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    const cp1x = Math.cos(angle - petalAngle) * r * 1.4;
    const cp1y = Math.sin(angle - petalAngle) * r * 1.4;
    const cp2x = Math.cos(angle + petalAngle) * r * 1.4;
    const cp2y = Math.sin(angle + petalAngle) * r * 1.4;
    if (i === 0) ctx.moveTo(0, 0);
    ctx.bezierCurveTo(cp1x, cp1y, px, py, px, py);
    ctx.bezierCurveTo(px, py, cp2x, cp2y, 0, 0);
  }
  ctx.closePath();
  ctx.restore();
}

// ─── Single petal particle ───────────────────────────────────────────────────
interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rot: number;
  rotSpeed: number;
  alpha: number;
  alphaDecay: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  life: number; // 0–1
  type: "single" | "flower";
}

const COLORS = [
  "#ffb7c5", // soft pink
  "#ff9eb5", // medium pink
  "#ffc8d8", // pale pink
  "#ff85a1", // deep pink
  "#ffd6e0", // blush
  "#ffadc5", // rose
  "#fff0f3", // near-white pink
];

function createPetal(x: number, y: number, burst = false): Petal {
  const speed = burst ? 2 + Math.random() * 5 : 0.5 + Math.random() * 2.5;
  const angle = burst
    ? Math.random() * Math.PI * 2
    : -Math.PI / 2 + (-0.8 + Math.random() * 1.6);

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: burst ? 4 + Math.random() * 10 : 5 + Math.random() * 8,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (-0.08 + Math.random() * 0.16) * (Math.random() > 0.5 ? 1 : -1),
    alpha: 0.85 + Math.random() * 0.15,
    alphaDecay: burst ? 0.012 + Math.random() * 0.018 : 0.006 + Math.random() * 0.01,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.04 + Math.random() * 0.06,
    wobbleAmp: 0.4 + Math.random() * 1.2,
    life: 1,
    type: Math.random() > 0.5 ? "flower" : "single",
  };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function SakuraCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const mouseRef = useRef({ x: -999, y: -999, moving: false });
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Resize canvas to window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, moving: true };
    };
    const onMouseStop = () => {
      mouseRef.current.moving = false;
    };
    let stopTimer: ReturnType<typeof setTimeout>;
    const onMove = (e: MouseEvent) => {
      onMouseMove(e);
      clearTimeout(stopTimer);
      stopTimer = setTimeout(onMouseStop, 100);
    };

    // Click burst
    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 18; i++) {
        petalsRef.current.push(createPetal(e.clientX, e.clientY, true));
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);

    // Animation loop
    const animate = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn trail petals while mouse is moving
      if (mouseRef.current.moving) {
        const spawnInterval = 40; // ms between spawns
        if (now - lastSpawnRef.current > spawnInterval) {
          const count = 1 + Math.floor(Math.random() * 2);
          for (let i = 0; i < count; i++) {
            // slight position jitter around cursor
            const jx = mouseRef.current.x + (-10 + Math.random() * 20);
            const jy = mouseRef.current.y + (-10 + Math.random() * 20);
            petalsRef.current.push(createPetal(jx, jy, false));
          }
          lastSpawnRef.current = now;
        }
      }

      // Update & draw
      petalsRef.current = petalsRef.current.filter((p) => p.alpha > 0.01);

      for (const p of petalsRef.current) {
        // Physics
        p.wobble += p.wobbleSpeed;
        p.vx += Math.sin(p.wobble) * p.wobbleAmp * 0.04;
        p.vy += 0.04 + Math.cos(p.wobble) * 0.02; // gentle gravity
        p.vx *= 0.98; // air drag
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.alpha -= p.alphaDecay;
        p.life = Math.max(0, p.life - p.alphaDecay);

        // Draw
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.type === "flower") {
          // Full 5-petal sakura
          buildPetalPath(ctx, p.x, p.y, p.radius, p.rot);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 1.4);
          grad.addColorStop(0, "#fff8fa");
          grad.addColorStop(0.4, p.color);
          grad.addColorStop(1, p.color + "88");
          ctx.fillStyle = grad;
          ctx.fill();

          // Center dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = "#ffafc5";
          ctx.fill();

          // Petal veins
          ctx.globalAlpha *= 0.25;
          for (let i = 0; i < 5; i++) {
            const a = (i * Math.PI * 2) / 5 - Math.PI / 2 + p.rot;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(
              p.x + Math.cos(a) * p.radius * 1.1,
              p.y + Math.sin(a) * p.radius * 1.1
            );
            ctx.strokeStyle = "#ff6a88";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        } else {
          // Single ellipse petal
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 0.55, p.radius, 0, 0, Math.PI * 2);
          const eg = ctx.createLinearGradient(0, -p.radius, 0, p.radius);
          eg.addColorStop(0, "#fff0f4");
          eg.addColorStop(0.5, p.color);
          eg.addColorStop(1, p.color + "99");
          ctx.fillStyle = eg;
          ctx.fill();
        }

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
}