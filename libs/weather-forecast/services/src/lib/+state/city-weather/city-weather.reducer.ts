import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as CityWeatherActions from './city-weather.actions';
import { CityWeatherEntity } from './city-weather.models';

export const CITYWEATHER_FEATURE_KEY = 'cityWeather';

export interface State extends EntityState<CityWeatherEntity> {
	selectedId?: string | number; // which CityWeather record has been selected
	loaded: boolean; // has the CityWeather list been loaded
	error?: string | null; // last known error (if any)
}

export interface CityWeatherPartialState {
	readonly [CITYWEATHER_FEATURE_KEY]: State;
}

export const cityWeatherAdapter: EntityAdapter<CityWeatherEntity> = createEntityAdapter<CityWeatherEntity>({
	selectId: cityWeather => cityWeather.name,
});

export const initialState: State = cityWeatherAdapter.getInitialState({
	// set initial required properties
	loaded: false,
});

const cityWeatherReducer = createReducer(
	initialState,
	on(CityWeatherActions.getCityWeatherSuccess, (state, { cityWeather }) =>
		cityWeatherAdapter.upsertOne(
			{ ...state.entities[cityWeather.name], ...cityWeather },
			{ ...state, loaded: true, error: null }
		)
	),
	on(CityWeatherActions.getCityWeatherFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: State | undefined, action: Action) {
	return cityWeatherReducer(state, action);
}
