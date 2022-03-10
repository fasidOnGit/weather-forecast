import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CITYWEATHER_FEATURE_KEY, State, cityWeatherAdapter } from './city-weather.reducer';

// Lookup the 'CityWeather' feature state managed by NgRx
export const getCityWeatherState = createFeatureSelector<State>(CITYWEATHER_FEATURE_KEY);

const { selectAll, selectEntities } = cityWeatherAdapter.getSelectors();

export const getCityWeatherError = createSelector(getCityWeatherState, (state: State) => state.error);

export const getAllCityWeather = createSelector(getCityWeatherState, (state: State) => selectAll(state));

export const getCityWeatherEntities = createSelector(getCityWeatherState, (state: State) => selectEntities(state));
