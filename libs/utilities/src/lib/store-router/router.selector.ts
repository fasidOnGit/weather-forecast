import { createFeatureSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

/**
 * Select Router.
 */
export const selectRouter = createFeatureSelector<fromRouter.RouterReducerState<any>>('router');
