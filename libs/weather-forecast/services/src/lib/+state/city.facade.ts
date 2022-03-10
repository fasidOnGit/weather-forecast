import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as CityActions from './city.actions';
import * as CitySelectors from './city.selectors';
import { selectRouter } from '@bp/util';
import { map } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Injectable()
export class CityFacade {
	allCity$ = this.store.pipe(select(CitySelectors.getAllCity));
	queryParams$ = this.store.pipe(
		select(selectRouter),
		map(routerState => routerState.state.queryParams)
	);
	cityNotFound$ = this.actions$.pipe(ofType(CityActions.cityNotFound));

	constructor(private readonly store: Store, private readonly actions$: Actions) {}
}
