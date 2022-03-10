import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CityEntity } from './+state/city.models';
import { CityWeatherEntity } from './+state/city-weather/city-weather.models';

@Injectable({ providedIn: 'root' })
export class WeatherForecastApiService {
	private _apiKey = '010721642521f31b0fbc8c3831d45951';
	private API_BASE = `http://api.openweathermap.org`;

	constructor(private readonly http: HttpClient) {}

	/**
	 * Gets City by name.
	 * @param name Name of the city.
	 */
	getCityByName(name: string): Observable<CityEntity | null> {
		const params = {
			q: name,
			limit: 1,
			appid: this._apiKey,
		};
		return this.http
			.get<CityEntity[]>(this.API_BASE + `/geo/1.0/direct`, { params })
			.pipe(map(cities => cities.pop() ?? null));
	}

	/**
	 * Get City weather by mode.
	 * @param city City.
	 * @param mode Mode.
	 * @return City weather entity.
	 */
	getCityWeatherByMode(city: CityEntity, mode: 'hourly' | 'daily'): Observable<CityWeatherEntity> {
		const excludeByMode = {
			hourly: 'current,minutely,daily,alerts',
			daily: 'current,minutely,hourly,alerts',
		};
		const params = {
			lat: city.lat,
			lon: city.lon,
			appid: this._apiKey,
			exclude: excludeByMode[mode],
		};
		return this.http
			.get<Omit<CityWeatherEntity, 'name'>>(this.API_BASE + '/data/2.5/onecall', { params })
			.pipe(map(res => ({ ...res, name: city.name })));
	}
}
