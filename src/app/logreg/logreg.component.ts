import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SamplesService } from '../samples.service';
import { LogregMarker, LineCoordinates, LineWithEndpoints } from '../types';
import { CanvasComponent } from '../canvas/canvas.component';
import { MlService } from '../ml.service';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { SimulationState } from '../types';

@Component({
  selector: 'app-logreg',
  templateUrl: './logreg.component.html',
  styleUrls: ['./logreg.component.css']
})
export class LogregComponent {

  constructor(
    public router: Router,
    private sampler: SamplesService,
    private ml: MlService) { }

  @ViewChild(CanvasComponent) canvas: CanvasComponent;

  data: LogregMarker[] = [];

  alpha: number = 0.1;

  boundary: LineCoordinates = { A: 0.0, B: 1.0, C: 0.0 };
  loss: number | undefined = undefined;
  currentBoundary: LineWithEndpoints = { x1: -1, y1: 0, x2: 1, y2: 1 };

  simulationState: SimulationState = 'beforeSampling';

  faPlay = faPlay;
  faPause = faPause;

  sample() {
    this.loss = undefined;
    this.boundary.A = 0.0;
    this.boundary.B = 1.0;
    this.boundary.C = 0.0;
    this.data = this.sampler.createRandomDataForLogreg(50).points;
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
    this.canvas.showLogregBoundary(this.getBoundary());
  }
  
  start() {
    this.simulationState = 'ready';
    this.markBoundary();
  }

  startDisabled() {
    return this.simulationState !== 'sampled';
  }

  step() {
    const {newBoundary, predictions} = this.ml.logregGradientDescent(
      this.alpha, this.data,this.boundary
    );
    this.boundary = newBoundary;
    this.markBoundary();
    this.loss = this.ml.logregLoss(this.data, predictions);
  }

  stepDisabled() {
    return ['sampled', 'completed', 'running', 'beforeSampling'].includes(this.simulationState);
  }

  run() {
    if (['sampled', 'paused'].includes(this.simulationState)) return;
    this.simulationState = 'running';
    this.step();
    setTimeout(() => this.run(), 10); 
  }

  runDisabled() {
    return ['running', 'sampled', 'beforeSampling', 'completed'].includes(this.simulationState);
  }

  pause() {
    this.simulationState = 'paused';
  }

  pauseDisabled() {
    return this.simulationState !== 'running';
  }

  boundaryDisabled() {
    return ['beforeSampling', 'sampled'].includes(this.simulationState);
  }

}
