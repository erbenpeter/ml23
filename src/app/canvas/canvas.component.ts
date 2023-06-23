import * as d3 from 'd3';
import { Component, Input } from '@angular/core';
import { BinaryMarker, LineWithEndpoints, SimpleMarker } from '../types';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent {

  @Input() scale: number = 300;

  clearSvg() {
    let container = d3.select('#ml-plot');
    container.html('');
    let svg = container.append('svg')
    .attr('viewBox',
      `${-this.scale} ${-this.scale} ${2 * this.scale} ${2 * this.scale}`
    )
    .attr('width', `${2 * this.scale}`)
    .attr('height', `${2 * this.scale}`);
    return svg;
  }

  getSvg() {
    return d3.select('#ml-plot').select('svg');
  }


  showMarkersLin(markers: SimpleMarker[]) {
    console.log('Trying to draw sample', markers);
    const svg = this.clearSvg();
    console.log('Cleared SVG:', svg);
    markers.forEach(marker => {
      svg.append('circle')
        .style('stroke', 'var(--clr-themered)')
        .style('fill', 'var(--clr-themered)')
        .attr('cx', this.scale * marker.x)
        .attr('cy', -this.scale * marker.y) // SVG Y axis flip
        .attr('r', 5);
    });
  }

  clearLinRegLine() {
    this.getSvg().select('#linregline').remove();
  }

  showLinRegLine(m: number, b:number) {
    console.log('drawing lin reg line', m, b);
    const x1 = -1;
    const y1 = m * x1 + b;
    const x2 = 1;
    const y2 = m * x2 + b;
    this.clearLinRegLine();
    this.getSvg()
    .append('line')
    .attr('id', 'linregline')
    .style('stroke', 'var(--clr-titlepurple)')
    .attr('stroke-width', 4)
    .attr('x1', x1 * this.scale).attr('y1', -y1 * this.scale)
    .attr('x2', x2 * this.scale).attr('y2', -y2 * this.scale);
  }

  showMarkersPer(markers: BinaryMarker[]) {
    const svg = this.clearSvg();
    markers.forEach(marker => {
      const color = marker.category === 'red'
        ? 'var(--clr-themered)' : 'var(--clr-themeblue)';
      svg.append('circle')
        .style('stroke', color)
        .style('fill', color)
        .attr('cx', this.scale * marker.x)
        .attr('cy', -this.scale * marker.y) // SVG Y axis flip
        .attr('r', 5);
    });
  }

  clearPerceptronBoundary() {
    this.getSvg().select('#perceptron-boundary').remove();
  }

  showPerceptronBoundary(line: LineWithEndpoints) {
    this.clearPerceptronBoundary();
    const { x1, y1, x2, y2 } = line;
    this.getSvg()
    .append('line')
    .attr('id', 'perceptron-boundary')
    .style('stroke', 'var(--clr-titlepurple)')
    .attr('stroke-width', 4)
    .attr('x1', x1 * this.scale).attr('y1', -y1 * this.scale)
    .attr('x2', x2 * this.scale).attr('y2', -y2 * this.scale);
  }

  clearLogregBoundary() {
    this.getSvg().select('#logreg-boundary').remove();
  }

  showLogregBoundary(line: LineWithEndpoints) {
    this.clearLogregBoundary();
    const { x1, y1, x2, y2 } = line;
    this.getSvg()
    .append('line')
    .attr('id', 'logreg-boundary')
    .style('stroke', 'var(--clr-titlepurple)')
    .attr('stroke-width', 4)
    .attr('x1', x1 * this.scale).attr('y1', -y1 * this.scale)
    .attr('x2', x2 * this.scale).attr('y2', -y2 * this.scale);
  }
  
  showOrigo() {
    this.getSvg()
    .append('circle')
    .style('fill', 'var(--clr-bglightblack)')
    .attr('r', 4)
    .attr('cx', 0)
    .attr('cy', 0);
  }

  clearBadMarker() {
    this.getSvg().select('#perceptron-bad-marker').remove();
  }

  showBadMarker(x: number, y: number) {
    this.clearBadMarker();
    this.getSvg()
    .append('circle')
    .attr('id', 'perceptron-bad-marker')
    .style('stroke-dasharray', ('3, 3'))
    .style('stroke', 'var(--clr-bglightblack)')
    .style('fill', 'none')
    .attr('r', 25)
    .attr('cx', x * this.scale)
    .attr('cy', -y * this.scale);
  }

}
