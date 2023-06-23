import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinregComponent } from './linreg/linreg.component';
import { PerceptronComponent } from './perceptron/perceptron.component';
import { LogregComponent } from './logreg/logreg.component';
import { SplashComponent } from './splash/splash.component';

const routes: Routes = [
  {path: '', component: SplashComponent},
  {path: 'linreg', component: LinregComponent},
  {path: 'perceptron', component: PerceptronComponent},
  {path: 'logreg', component: LogregComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
