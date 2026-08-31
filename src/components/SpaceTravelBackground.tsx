import React, { useEffect, useState } from 'react';

interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  layer: 1 | 2 | 3;
  distance: 'distant' | 'medium' | 'close';
  duration: number;
  delay: number;
}

const SpaceTravelBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = (): Star[] => {
      const starCount = 180;
      const generatedStars: Star[] = [];

      for (let i = 0; i < starCount; i++) {
        const rand = Math.random();
        let layer: 1 | 2 | 3;
        let distance: 'distant' | 'medium' | 'close';
        let size: number;

        // Distribute stars across 3 parallax layers
        if (rand < 0.5) {
          layer = 1;
          distance = 'distant';
          size = 0.5 + Math.random() * 1;
        } else if (rand < 0.75) {
          layer = 2;
          distance = 'medium';
          size = 1 + Math.random() * 1.5;
        } else {
          layer = 3;
          distance = 'close';
          size = 1.5 + Math.random() * 2;
        }

        generatedStars.push({
          id: `star-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size,
          layer,
          distance,
          duration: 14 + Math.random() * 12,
          delay: -Math.random() * 8,
        });
      }

      return generatedStars;
    };

    setStars(generateStars());
  }, []);

  return (
    <div className="space-travel-container">
      <div className="space-travel-stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`space-star layer-${star.layer} ${star.distance}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow overlay */}
      <div className="space-ambient-glow" />

      {/* Nebula accent for depth */}
      <div className="space-nebula-accent" />
    </div>
  );
};

export default SpaceTravelBackground;
