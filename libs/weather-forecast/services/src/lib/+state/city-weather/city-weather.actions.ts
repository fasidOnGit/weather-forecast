import { createAction, props } from '@ngrx/store';
import { CityWeatherEntity } from './city-weather.models';
import { CityEntity } from '../city.models';

export const getCityWeather = createAction(
	'[City] Get City Weather by Mode',
	props<{ city: CityEntity; mode: 'hourly' | 'daily' }>()
);
export const getCityWeatherSuccess = createAction(
	'[City] Get City Weather by Mode Success',
	props<{ cityWeather: CityWeatherEntity }>()
);
export const getCityWeatherFailure = createAction('[City] Get City Weather by Mode Failure', props<{ error: any }>());
