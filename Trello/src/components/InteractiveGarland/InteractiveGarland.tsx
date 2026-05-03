import { useState, useEffect, useMemo } from "react";


type ThemeType = {
  star: string;
  starGlow: string;
};

type Props = {
  theme: ThemeType;
};

function InteractiveGarland({ theme }: Props) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setTime((t) => t + 1);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      leftPercent: i * 2.5 + 1.25,
      stringHeight: 30 + Math.sin(i) * 20 + Math.random() * 30,
      size: 10 + Math.random() * 8,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => {
        const tilt = Math.sin(time * 0.03 + star.phase) * 8;
        const pulse = Math.sin(time * 0.08 + star.phase) * 0.12;

        return (
          <div
            key={star.id}
            className="absolute top-0 flex flex-col items-center"
            style={{
              left: `${star.leftPercent}%`,
              transform: `rotate(${tilt}deg)`,
              transformOrigin: "top center",
            }}
          >
            <div
              className="w-[1px] opacity-30"
              style={{
                height: `${star.stringHeight}px`,
                background: `linear-gradient(to bottom, ${theme.star}, transparent)`,
              }}
            />

            <svg
              width={star.size}
              height={star.size}
              viewBox="0 0 24 24"
              style={{
                transform: `scale(${1 + pulse})`,
                opacity: 0.85,
                transition: "all 0.3s ease",
                filter: `drop-shadow(0 0 10px ${theme.starGlow})`,
              }}
            >
              <path
                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
                fill={theme.star}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

export default InteractiveGarland;