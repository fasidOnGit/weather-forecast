import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import * as CityActions from './city.actions';
import * as CityWeatherActions from './city-weather/city-weather.actions';
import * as CityFeature from './city.reducer';
import { WeatherForecastApiService } from '../weather-forecast-api.service';
import { filter, map, take } from 'rxjs';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { CityFacade } from '@bp/weather-forecast/services';

@Injectable()
export class CityEffects {
	navigation$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ROUTER_NAVIGATION),
			map((val: any) => {
				const qp = val.payload.routerState.queryParams;
				if (!qp?.search) {
					return CityActions.addCityFailure({ error: 'Please enter a city name' });
				}
				return CityActions.addCity({ name: qp.search });
			})
		)
	);
	addCity$ = createEffect(() =>
		this.dataPersistence.fetch(CityActions.addCity, {
			run: (action: ReturnType<typeof CityActions.addCity>, state: CityFeature.CityPartialState) => {
				return this.weatherForecastApiService.getCityByName(action.name).pipe(
					map(city => {
						if (!city) {
							return CityActions.cityNotFound({ name: action.name });
						}
						return CityActions.addCitySuccess({ city });
					})
				);
			},
			onError: (action: ReturnType<typeof CityActions.addCity>, error) => {
				console.error('Error', error);
				return CityActions.addCityFailure({ error });
			},
		})
	);

	addCityWeatherByMode$ = createEffect(() =>
		this.dataPersistence.fetch(CityActions.addCitySuccess, {
			run: (action: ReturnType<typeof CityActions.addCitySuccess>, state: CityFeature.CityPartialState) => {
				return this.cityFacade.queryParams$.pipe(
					take(1),
					filter(qp => !!qp.mode),
					map(qp => CityWeatherActions.getCityWeather({ city: action.city, mode: qp.mode }))
				);
			},
			onError: (action: ReturnType<typeof CityActions.addCitySuccess>, error) => {
				console.error('Error', error);
				return CityWeatherActions.getCityWeatherFailure({ error });
			},
		})
	);

	constructor(
		private readonly actions$: Actions,
		private readonly weatherForecastApiService: WeatherForecastApiService,
		private readonly dataPersistence: DataPersistence<CityFeature.CityPartialState>,
		private readonly cityFacade: CityFacade
	) {}
}
