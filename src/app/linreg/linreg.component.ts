import { Component, ViewChild } from '@angular/core';
import { SamplesService } from '../samples.service';
import { NoiseType, SimpleMarker } from '../types';
import { MlService } from '../ml.service';
import { Router } from '@angular/router';
import { CanvasComponent } from '../canvas/canvas.component';


@Component({
  selector: 'app-linreg',
  templateUrl: './linreg.component.html',
  styleUrls: ['./linreg.component.css']
})
export class LinregComponent {

  constructor(
    private sampler: SamplesService,
    private ml: MlService,
    public router: Router
  ) {}

  @ViewChild(CanvasComponent) canvas: CanvasComponent;

  noiseType: NoiseType = 'usmall';

  noiseTypes = [
    { id: 'usmall', name: 'egyenletes, kicsi' },
    { id: 'ubig', name: 'egyenletes, nagy' },
    { id: 'nsmall', name: 'normális, kicsi' },
    { id: 'nbig', name: 'normális, nagy' },
  ];

  data: SimpleMarker[] = [];
  avgLoss: number | undefined = undefined;

  ngOnInit() {
    console.log('linreg');
  }

  sample() {
    this.avgLoss = undefined;
    this.data = this.sampler.createRandomDataForLinReg(50, this.noiseType).points;
    this.canvas.showMarkersLin(this.data);
  }

  learn() {
    const { m, b, loss } = this.ml.linreg(this.data);
    this.avgLoss = loss;
    this.canvas.showLinRegLine(m, b);
  }

}
