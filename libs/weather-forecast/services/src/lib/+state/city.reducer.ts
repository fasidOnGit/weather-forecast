import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as CityActions from './city.actions';
import { CityEntity } from './city.models';

export const CITY_FEATURE_KEY = 'city';

export interface State extends EntityState<CityEntity> {
	loaded: boolean; // has the City list been loaded
	error?: string | null; // last known error (if any)
}

export interface CityPartialState {
	readonly [CITY_FEATURE_KEY]: State;
}

export const cityAdapter: EntityAdapter<CityEntity> = createEntityAdapter<CityEntity>({ selectId: city => city.name });

export const initialState: State = cityAdapter.getInitialState({
	// set initial required properties
	loaded: false,
});

const cityReducer = createReducer(
	initialState,
	on(CityActions.addCityFailure, (state, { error }) => ({ ...state, error })),
	on(CityActions.addCitySuccess, (state, { city }) =>
		cityAdapter.upsertOne(city, { ...state, error: null, loaded: true })
	)
);

export function reducer(state: State | undefined, action: Action) {
	return cityReducer(state, action);
}
