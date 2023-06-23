import { Injectable } from '@angular/core';
import { BinaryMarker, LogregMarker, NoiseType } from './types';
import { GeometryService } from './geometry.service';

@Injectable({
  providedIn: 'root'
})
export class SamplesService {

  constructor(private geo: GeometryService) { }

  rndGauss(N = 10) {
    let s = 0;
    for (let i = 0; i < N; i++) {
      s += Math.random();
    }
    return (s - N / 2) / N;
  }

  randomNoise(noiseType: NoiseType = 'usmall'): number {
    switch(noiseType) {
      case 'usmall': return (Math.random() * 2 - 1) * 0.2;
      case 'ubig': return (Math.random() * 2 - 1) * 0.5;
      case 'nsmall': return this.rndGauss() * 0.6;
      case 'nbig': return this.rndGauss() * 2;
      default: return 0.0;
    } 
  }

  createRandomDataForLinReg(n: number, noiseType: NoiseType) {
    const leftY = Math.random() * 2 - 1;
    const rightY = Math.random() * 2 - 1;
    const m = (rightY - leftY) / 2;
    // m * 1 + b = rightY => b = rightY - 1 * m;
    const b = rightY - m;
  
    const points = [];
    while (points.length < n) {
      const x = Math.random() * 1.8 - 0.9;
      const y = m * x + b + this.randomNoise(noiseType);
      points.push({ x, y });
    }
  
    return {
      points,
      line: { m, b } // for debugging
    };
  }

  createRandomDataForPerceptron(n: number) {
    const leftY = Math.random() * 2 - 1;
    const rightY = Math.random() * 2 - 1;
    const eps = 5 / 100;

    // line coordinates
    const A = leftY - rightY;
    const B = 2;
    const C = -(-(leftY - rightY) + 2 * leftY);

    const points: BinaryMarker[] = [];
    while (points.length < n) {
      const x = Math.random() * 1.8 - 0.9;
      const y = Math.random() * 1.8 - 0.9;
      if (this.geo.above(A, B, C, x, y, eps)) points.push({ x, y, category: 'red' });
      if (this.geo.below(A, B, C, x, y, eps)) points.push({ x, y, category: 'blue' });
    }

    return {
      points,
      line: { x1: -1, y1: leftY, x2: 1, y2: rightY }, // for debugging
      boundary: { A, B, C } // for debugging
    };
  }

  createRandomDataForLogreg(n: number) {
    const CX1 = Math.random() * 2 - 1;
    const CY1 = Math.random() * 2 - 1;
    const CX2 = Math.random() * 2 - 1;
    const CY2 = Math.random() * 2 - 1;

    const points: LogregMarker[] = [];
    while (points.length < n) {
      const x = this.rndGauss() * 3;
      const y = this.rndGauss() * 3;
      const xx = CX1 + x;
      const yy = CY1 + y;
      if (-1 < xx && xx < 1 && -1 < yy && yy < 1) {
        points.push({ x: xx, y: y, category: 'red', t: 1 });
      }
      
    }
    while (points.length < 2 * n) {
      const x = this.rndGauss() * 3;
      const y = this.rndGauss() * 3;
      const xx = CX2 + x;
      const yy = CY2 + y;
      if (-1 < xx && xx < 1 && -1 < yy && yy < 1) {
        points.push({ x: xx, y: yy, category: 'blue', t: 0 });
      }
    }
  
    return {
      points
    };
  }
}
