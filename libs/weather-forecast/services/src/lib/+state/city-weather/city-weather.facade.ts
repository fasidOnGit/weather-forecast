import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as CityWeatherSelectors from './city-weather.selectors';
import * as CityWeatherActions from './city-weather.actions';
import * as CitySelectors from '../city.selectors';
import { share, take } from 'rxjs';
import { TCityWeatherOutput } from '../../city-weather-viewer/city-weather-viewer-filter.component';
import { CityEntity } from '../city.models';

@Injectable()
export class CityWeatherFacade {
	allCityWeather$ = this.store.pipe(select(CityWeatherSelectors.getAllCityWeather), share());

	constructor(private readonly store: Store) {}

	fetchCityWeather(value: TCityWeatherOutput): void {
		this.store
			.select(CitySelectors.getCityEntities)
			.pipe(take(1))
			.subscribe(cities => {
				this.store.dispatch(
					CityWeatherActions.getCityWeather({ city: cities[value.search] as CityEntity, mode: value.mode })
				);
			});
	}
}
