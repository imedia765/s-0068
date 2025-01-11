import { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import { Card } from '@/components/ui/card';

interface WebMetricsP5Props {
  data: Array<{ metric: string; value: string }>;
}

export const WebMetricsP5 = ({ data }: WebMetricsP5Props) => {
  const particles: Array<{ x: number; y: number; speedX: number; speedY: number }> = [];
  const numParticles = data.filter(d => d.value === 'Present' || d.value === 'Yes').length * 5;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(600, 300).parent(canvasParentRef);
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        speedX: p5.random(-1, 1),
        speedY: p5.random(-1, 1)
      });
    }
  };

  const draw = (p5: p5Types) => {
    p5.background(0, 25);
    
    particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0 || particle.x > p5.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > p5.height) particle.speedY *= -1;
      
      p5.fill(p5.color(252, 82, 74));
      p5.noStroke();
      p5.ellipse(particle.x, particle.y, 4, 4);
      
      particles.forEach(other => {
        const d = p5.dist(particle.x, particle.y, other.x, other.y);
        if (d < 50) {
          p5.stroke(252, 82, 74, 50);
          p5.line(particle.x, particle.y, other.x, other.y);
        }
      });
    });
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Interactive Particle Network (p5.js)</h3>
      <Sketch setup={setup} draw={draw} />
    </Card>
  );
};