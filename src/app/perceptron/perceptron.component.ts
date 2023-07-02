import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SamplesService } from '../samples.service';
import { BinaryMarker, LineCoordinates, LineWithEndpoints } from '../types';
import { CanvasComponent } from '../canvas/canvas.component';
import { MlService } from '../ml.service';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { SimulationState } from '../types';


@Component({
  selector: 'app-perceptron',
  templateUrl: './perceptron.component.html',
  styleUrls: ['./perceptron.component.css']
})
export class PerceptronComponent {

  constructor(
    public router: Router,
    private sampler: SamplesService,
    private ml: MlService) { }

  @ViewChild(CanvasComponent) canvas: CanvasComponent;

  data: BinaryMarker[] = [];

  boundary: LineCoordinates = { A: 0.0, B: 1.0, C: 0.0 };
  loss: number | undefined = undefined;
  currentBoundary: LineWithEndpoints = { x1: -1, y1: 0, x2: 1, y2: 1 };

  simulationState: SimulationState = 'beforeSampling';

  badX: number | undefined = undefined;
  badY: number | undefined = undefined;
  badSide: 'above' | 'below' | undefined = undefined;

  faPlay = faPlay;
  faPause = faPause;
  timeoutId: any = null;

  sample() {
    this.loss = undefined;
    this.boundary.A = 0.0;
    this.boundary.B = 1.0;
    this.boundary.C = 0.0;
    this.data = this.sampler.createRandomDataForPerceptron(50).points;
    this.canvas.showMarkersPer(this.data);
    this.simulationState = 'sampled';
  }

  getBoundary() {
    const x1 = -1;
    const y1 = (-x1 * this.boundary.A - this.boundary.C) / this.boundary.B;
    const x2 = 1;
    const y2 = (-x2 * this.boundary.A - this.boundary.C) / this.boundary.B;
    return { x1, y1, x2, y2 };
  }

  markBoundary() {
    this.canvas.showPerceptronBoundary(this.getBoundary());
  }
  
  start() {
    this.simulationState = 'ready';
    this.markBoundary();
    const {numBad, fx, fy, side} = this.ml.perceptronFindBad(this.data, this.boundary);
    this.loss = numBad;
    if (numBad > 0) {
      this.canvas.showBadMarker(fx, fy);
      this.badX = fx;
      this.badY = fy;
      this.badSide = side;
    }
  }

  startDisabled() {
    return this.simulationState !== 'sampled';
  }

  step() {
    if (this.loss! > 0) {
      this.boundary = this.ml.perceptronNewBoundary(
        this.badX!, this.badY!, this.badSide!, this.boundary
      );
      this.markBoundary();
      this.canvas.clearBadMarker();
      const {numBad, fx, fy, side} = this.ml.perceptronFindBad(this.data, this.boundary);
      this.loss = numBad;
      if (numBad > 0) {
        this.canvas.showBadMarker(fx, fy);
        this.badX = fx;
        this.badY = fy;
        this.badSide = side;
      } else {
        this.badX = undefined;
        this.badY = undefined;
        this.badSide = undefined;
      }
    } else {
      this.simulationState = 'completed';
    }
  }

  stepDisabled() {
    return ['sampled', 'completed', 'running', 'beforeSampling'].includes(this.simulationState);
  }

  run() {
    if (['sampled', 'paused'].includes(this.simulationState)) return;
    this.simulationState = 'running';
    this.step();
    this.timeoutId = setTimeout(() => this.run(), 1000); 
  }

  runDisabled() {
    return ['running', 'sampled', 'beforeSampling', 'completed'].includes(this.simulationState);
  }

  pause() {
    this.simulationState = 'paused';
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  pauseDisabled() {
    return this.simulationState !== 'running';
  }

  boundaryDisabled() {
    return ['beforeSampling', 'sampled'].includes(this.simulationState);
  }

  back() {
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.router.navigate(['/'])
  }

}
