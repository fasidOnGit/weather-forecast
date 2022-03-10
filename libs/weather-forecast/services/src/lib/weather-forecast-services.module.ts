import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityWeatherViewerComponent } from './city-weather-viewer/city-weather-viewer.component';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromCity from './+state/city.reducer';
import { CityEffects } from './+state/city.effects';
import { CityFacade } from './+state/city.facade';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CityWeatherViewerFilterComponent } from './city-weather-viewer/city-weather-viewer-filter.component';
import { DataPersistence } from '@nrwl/angular';
import { HttpClientModule } from '@angular/common/http';
import * as fromCityWeather from './+state/city-weather/city-weather.reducer';
import { CityWeatherEffects } from './+state/city-weather/city-weather.effects';
import { CityWeatherFacade } from './+state/city-weather/city-weather.facade';
import { DataGridModule } from '@bp/design-system';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: CityWeatherViewerComponent,
			},
		]),
		StoreModule.forFeature(fromCity.CITY_FEATURE_KEY, fromCity.reducer),
		EffectsModule.forFeature([CityEffects, CityWeatherEffects]),
		ReactiveFormsModule,
		MatFormFieldModule,
		DataGridModule,
		MatInputModule,
		MatRadioModule,
		HttpClientModule,
		StoreModule.forFeature(fromCityWeather.CITYWEATHER_FEATURE_KEY, fromCityWeather.reducer),
	],
	declarations: [CityWeatherViewerComponent, CityWeatherViewerFilterComponent],
	providers: [CityFacade, DataPersistence, CityWeatherFacade],
})
export class WeatherForecastServicesModule {}
