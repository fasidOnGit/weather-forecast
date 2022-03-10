import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		RouterModule.forRoot([
			{
				path: '',
				loadChildren: () => import('@bp/weather-forecast/services').then(m => m.WeatherForecastServicesModule),
			},
			{
				path: '**',
				redirectTo: '/',
			},
		]),
	],
})
export class AppRoutingModule {}
