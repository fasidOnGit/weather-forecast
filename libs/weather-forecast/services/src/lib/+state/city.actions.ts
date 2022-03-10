import { createAction, props } from '@ngrx/store';
import { CityEntity } from './city.models';

export const addCity = createAction('[City] Add City', props<{ name: string }>());

export const addCitySuccess = createAction('[City] Add City Success', props<{ city: CityEntity }>());

export const addCityFailure = createAction('[City] Add City Failure', props<{ error: any }>());

export const cityNotFound = createAction('[City] City not found', props<{ name: string }>());
