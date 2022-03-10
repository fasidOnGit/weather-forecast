import { Params, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

/**
 * Router State Url
 */
export interface RouterStateUrl {
	/**
	 * Url
	 */
	url: string;
	/**
	 * params
	 */
	params: Params;
	/**
	 * Query params.
	 */
	queryParams: Params;
}

/**
 * Custom Serializer.
 */
export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
	/**
	 * Serialize.
	 * @param routerState Router State.
	 * @return Router State Url
	 */
	serialize(routerState: RouterStateSnapshot): RouterStateUrl {
		let route = routerState.root;

		while (route.firstChild) {
			route = route.firstChild;
		}

		const {
			url,
			root: { queryParams },
		} = routerState;
		const { params } = route;

		// Only return an object including the URL, params and query params
		// instead of the entire snapshot
		return { url, params, queryParams };
	}
}
