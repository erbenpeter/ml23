import { Injectable } from '@angular/core';
import { BinaryMarker, LineCoordinates, LogregMarker, SimpleMarker } from './types';
import { GeometryService } from './geometry.service';

@Injectable({
  providedIn: 'root'
})
export class MlService {

  constructor(private geo: GeometryService) { }

  linreg(points: SimpleMarker[]) {
    const n = points.length;
    const SX = points.reduce((prev, curr) => prev + curr.x, 0);
    const SY = points.reduce((prev, curr) => prev + curr.y, 0);
    const SXX = points.reduce((prev, curr) => prev + curr.x * curr.x, 0);
    const SXY = points.reduce((prev, curr) => prev + curr.x * curr.y, 0);
    const m = (n * SXY - SX * SY) / (n * SXX - SX * SX);
    const b = (SY - m * SX) / n;
    let loss = 0.0;
    points.forEach(point => {
      const py = m * point.x + b;
      loss += (point.y - py) * (point.y - py);
    });
    loss /= n;
    return { m, b, loss };
  }

  perceptronFindBad(points: BinaryMarker[], boundary: LineCoordinates) {
    let numBad = 0;
    let side: 'above' | 'below' | undefined = undefined;
    let [fx, fy] = [0, 0];
    const start = Math.floor(Math.random() * points.length);
    for (let i = 0; i < points.length; i++) {
      const idx = (start + i) % points.length; 
      const {x, y} = points[idx];
      if (
        this.geo.above(boundary.A, boundary.B, boundary.C, x, y)
        && points[idx].category === 'blue'
      ) {
        numBad++;
        if (numBad === 1) {
          fx = x;
          fy = y;
          side = 'above';
        }
      }
      if (
        this.geo.below(boundary.A, boundary.B, boundary.C, x, y)
        && points[idx].category === 'red'
      ) {
        numBad++;
        if (numBad === 1) {
          fx = x;
          fy = y;
          side = 'below';
        }
      }
    }
    return {numBad, fx, fy, side};
  }

  perceptronNewBoundary(badX: number, badY: number, side: 'above' | 'below', oldBoundary: LineCoordinates) {
    if (side === 'above') {
      return {
        A: oldBoundary.A - badX,
        B: oldBoundary.B - badY,
        C: oldBoundary.C - 1,
      };
    } else {
      return {
        A: oldBoundary.A + badX,
        B: oldBoundary.B + badY,
        C: oldBoundary.C + 1,
      };
    }
  }

  sigmoid(x: number) {
    return 1 / (1 + Math.exp(-x));
  }

  logregGradientDescent(alpha: number, points: LogregMarker[], oldBoundary: LineCoordinates) {
    const {A, B, C} = oldBoundary;
    let [gradA, gradB, gradC] = [0, 0, 0];
    points.forEach(point => {
      const diff = this.sigmoid(this.geo.u(A, B, C, point.x, point.y)) - point.t;
      gradA += alpha * point.x * diff;
      gradB += alpha * point.y * diff;
      gradC += alpha * 1.0     * diff;
    });
    const newBoundary: LineCoordinates = {
      A: A - gradA,
      B: B - gradB,
      C: C - gradC,
    };
    const predictions = points.map(
      point => this.sigmoid(this.geo.u(newBoundary.A, newBoundary.B, newBoundary.C, point.x, point.y))
    );

    return { newBoundary, predictions };
  }

  logregLoss(points: LogregMarker[], predictions: number[]) {
    const n = points.length;
    let avgLoss = 0.0;
    for (let i = 0; i < n; i++) {
      const { x, y, t } = points[i];
      const f = predictions[i];
      avgLoss += (t*Math.log(f) + (1-t)*Math.log(1-f));
    }
    return -avgLoss / n;
  }
}
