export interface SimpleMarker { x: number, y: number };

export interface BinaryMarker { x: number, y: number, category: 'red' | 'blue' };

export interface LogregMarker { x: number, y: number, category: 'red' | 'blue', t: number };

export interface LineWithEndpoints { x1: number, y1: number, x2: number, y2: number };

export interface LineCoordinates { A: number, B: number, C: number };

export type NoiseType =  'usmall' | 'ubig' | 'nsmall' | 'nbig';

export type SimulationState = 'beforeSampling' | 'sampled' | 'ready' | 'running' | 'paused' | 'completed';
