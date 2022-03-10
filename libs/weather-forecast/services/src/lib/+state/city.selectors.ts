import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CITY_FEATURE_KEY, State, cityAdapter } from './city.reducer';

// Lookup the 'City' feature state managed by NgRx
export const getCityState = createFeatureSelector<State>(CITY_FEATURE_KEY);

const { selectAll, selectEntities } = cityAdapter.getSelectors();

export const getCityLoaded = createSelector(getCityState, (state: State) => state.loaded);

export const getCityError = createSelector(getCityState, (state: State) => state.error);

export const getAllCity = createSelector(getCityState, (state: State) => selectAll(state));

export const getCityEntities = createSelector(getCityState, (state: State) => selectEntities(state));
