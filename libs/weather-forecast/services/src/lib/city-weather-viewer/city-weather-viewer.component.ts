import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CityFacade, CityWeatherEntity, CityWeatherFacade } from '@bp/weather-forecast/services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IDataGridColumn } from '@bp/design-system';
import { TCityWeatherOutput } from './city-weather-viewer-filter.component';

@Component({
	selector: 'bp-city-weather-viewer',
	templateUrl: './city-weather-viewer.component.html',
	styleUrls: ['./city-weather-viewer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityWeatherViewerComponent implements OnDestroy {
	public static hourly = ['03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'];
	public static daily = ['Mo', 'Te', 'We', 'Th', 'Fr', 'Sa', 'Su'];
	form: FormGroup;
	destroy$: Subject<void>;
	markAsDirty$: Subject<void>;
	columns: IDataGridColumn[];
	constructor(
		public readonly cityFacade: CityFacade,
		public readonly cityWeatherFacade: CityWeatherFacade,
		private readonly router: Router,
		private readonly fb: FormBuilder,
		private readonly cdr: ChangeDetectorRef
	) {
		this.destroy$ = new Subject();
		this.markAsDirty$ = new Subject();
		this.form = this.fb.group({
			search: [''],
			mode: ['hourly', Validators.required],
		});
		this.columns = this.getColumnsByMode(this.form.value.mode);
		this.cityFacade.queryParams$.pipe(takeUntil(this.destroy$)).subscribe(qp => {
			this.columns = this.getColumnsByMode(qp.mode);
			this.form.setValue({ search: qp.search, mode: qp.mode });
			this.cdr.markForCheck();
		});
		this.cityFacade.cityNotFound$.pipe(takeUntil(this.destroy$)).subscribe(val => {
			this.form.controls.search.setErrors({ cityNotFound: val.name });
			this.markAsDirty$.next();
		});
	}
	ngOnDestroy(): void {
		this.destroy$.next();
	}

	filterChange($event: { mode: 'hourly' | 'daily'; search: string }): void {
		this.router.navigate(['.'], { queryParams: $event });
	}

	/**
	 * Get columns by mode.
	 * @param mode
	 * @private
	 */
	private getColumnsByMode(mode: 'hourly' | 'daily'): IDataGridColumn[] {
		const fetchCityWeather = (cityWeather: CityWeatherEntity, mode: TCityWeatherOutput['mode']) => {
			!!cityWeather[mode] || this.cityWeatherFacade.fetchCityWeather({ search: cityWeather.name, mode });
		};
		if (mode === 'hourly') {
			return [
				{
					title: 'cityname',
					label: 'City Name',
					property: 'name',
					valueTransformer: (element: CityWeatherEntity) => {
						fetchCityWeather(element, 'hourly');
						return element.name;
					},
				},
				...CityWeatherViewerComponent.hourly.map(time => ({
					title: time,
					label: time,
					property: time.split(':').shift() as string,
					valueTransformer: (element: CityWeatherEntity) => {
						const res = element['hourly']?.[parseInt(time.split(':').shift() as string)]?.temp;
						return res ? `${res}°` : `-`;
					},
				})),
			];
		}
		return [
			{
				title: 'cityname',
				label: 'City Name',
				property: 'name',
				valueTransformer: (element: CityWeatherEntity) => {
					fetchCityWeather(element, 'daily');
					return element.name;
				},
			},
			...CityWeatherViewerComponent.daily.map((day, idx, daily) => {
				return {
					title: day,
					label: day,
					property: day,
					valueTransformer: (element: CityWeatherEntity, property: string) => {
						let dayIndex = daily.indexOf(property) + 1;
						if (dayIndex === daily.length) {
							dayIndex = 0; //sunday starts with 0
						}
						const res = element.daily?.find(info => new Date(info.dt * 1000).getDay() === dayIndex)?.temp
							.day;
						return res ? res + `°` : `-`;
					},
				};
			}),
		];
	}
}
