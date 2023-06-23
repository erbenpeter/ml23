import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  constructor() { }

  above(A: number, B: number, C: number, x: number, y: number, eps: number = 0): boolean {
    return (A * x + B * y + C) / Math.sqrt(A * A + B * B) > eps;
  }
  
  below(A: number, B: number, C: number, x: number, y: number, eps: number = 0): boolean {
    return (A * x + B * y + C) / Math.sqrt(A * A + B * B) < -eps;
  }

  u(A: number, B: number, C: number, x: number, y: number) {
    return (A * x + B * y + C);
  }
}