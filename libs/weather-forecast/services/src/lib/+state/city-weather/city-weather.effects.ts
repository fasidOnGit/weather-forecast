import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import * as CityWeatherActions from './city-weather.actions';
import * as CityWeatherFeature from './city-weather.reducer';
import { WeatherForecastApiService } from '../../weather-forecast-api.service';
import { map } from 'rxjs';

@Injectable()
export class CityWeatherEffects {
	init$ = createEffect(() =>
		this.dataPersistence.fetch(CityWeatherActions.getCityWeather, {
			run: (
				action: ReturnType<typeof CityWeatherActions.getCityWeather>,
				state: CityWeatherFeature.CityWeatherPartialState
			) => {
				return this.weatherForecastApiService
					.getCityWeatherByMode(action.city, action.mode)
					.pipe(map(cityWeather => CityWeatherActions.getCityWeatherSuccess({ cityWeather })));
			},
			onError: (action: ReturnType<typeof CityWeatherActions.getCityWeather>, error) => {
				console.error('Error', error);
				return CityWeatherActions.getCityWeatherFailure({ error });
			},
		})
	);

	constructor(
		// private readonly actions$: Actions,
		private readonly weatherForecastApiService: WeatherForecastApiService,
		private readonly dataPersistence: DataPersistence<CityWeatherFeature.CityWeatherPartialState>
	) {}
}
