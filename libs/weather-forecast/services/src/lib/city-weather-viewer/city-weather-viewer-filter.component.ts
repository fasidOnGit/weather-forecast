import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Optional,
	Output,
	Self,
} from '@angular/core';
import {
	AbstractControl,
	ControlContainer,
	ControlValueAccessor,
	FormBuilder,
	FormGroup,
	NgControl,
	ValidationErrors,
	Validator,
	Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { ImmediateErrorStateMatcher } from '@bp/util';
export type TCityWeatherOutput = { mode: 'hourly' | 'daily'; search: string };
@Component({
	selector: 'bp-city-weather-viewer-filter',
	template: `
		<div class="filters" [formGroup]="form">
			<mat-form-field appearance="outline">
				<mat-label>Add city</mat-label>
				<input
					type="text"
					[errorStateMatcher]="immediateErrorMatcher"
					matInput
					formControlName="search"
					placeholder="berlin moscow"
				/>
				<mat-error *ngIf="form.controls.search.hasError('cityNotFound')">
					<strong>{{ form.get('search')?.errors?.cityNotFound }}</strong> is not found.
				</mat-error>
			</mat-form-field>
			<mat-radio-group aria-label="Select a mode" formControlName="mode">
				<mat-radio-button *ngFor="let mode of modes" [value]="mode.id">{{ mode.label }}</mat-radio-button>
			</mat-radio-group>
		</div>
	`,
	styleUrls: ['./city-weather-viewer-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityWeatherViewerFilterComponent implements OnDestroy, ControlValueAccessor, Validator, OnInit {
	/**
	 * Machine to set to go-live.
	 */
	@Input() public set value(val: TCityWeatherOutput) {
		this.writeValue(val);
	}
	/**
	 * Indicator on when should mark all controls as dirty.
	 */
	@Input() public markAllDirty$: Subject<void>;
	/**
	 * Filter change.
	 */
	@Output() onFilterChange: EventEmitter<TCityWeatherOutput>;
	/**
	 * Formgroup.
	 */
	public form: FormGroup;
	/**
	 * Modes.
	 */
	public modes: Array<Record<'id' | 'label', string>>;
	/**
	 * Immediate error matcher.
	 */
	public immediateErrorMatcher: ErrorStateMatcher;
	/**
	 * Unsubscribe subject on destroy.
	 * @private
	 */
	private destroy$: Subject<void>;

	constructor(
		private readonly fb: FormBuilder,
		@Self() @Optional() private controlContainer: ControlContainer,
		@Self() @Optional() private ngControl: NgControl,
		private readonly cdr: ChangeDetectorRef
	) {
		this.immediateErrorMatcher = new ImmediateErrorStateMatcher();
		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}
		this.form = this.fb.group({
			search: [''],
			mode: ['hourly', Validators.required],
		});
		this.modes = [
			{ id: 'hourly', label: 'Hourly' },
			{ id: 'daily', label: 'Daily' },
		];
		this.onFilterChange = new EventEmitter();
		this.destroy$ = new Subject();
		this.markAllDirty$ = new Subject<void>();
	}
	/**
	 * On Init Hook.
	 */
	public ngOnInit(): void {
		if (this.controlContainer && this.controlContainer.control !== null) {
			this.form = this.controlContainer.control as FormGroup;
		}
		this.form.controls.search.valueChanges
			.pipe(
				takeUntil(this.destroy$),
				distinctUntilChanged(),
				tap(() => this.form.controls.search.setErrors(null)),
				debounceTime(400)
			)
			.subscribe(search => {
				this.onFilterChange.next({ ...this.form.value, search });
			});
		this.form.controls.mode.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe(mode => {
			this.onFilterChange.next({ ...this.form.value, mode });
		});
		this.immediateErrorMatcher = new ImmediateErrorStateMatcher();
		this.orchestrateFormSubmit();
	}

	/**
	 * On Destroy hook.
	 */
	public ngOnDestroy(): void {
		this.destroy$.next();
	}

	/**
	 * Called by angular to update the comment value.
	 * @inheritDoc {@link ControlValueAccessor.writeValue}
	 */
	public writeValue(obj: TCityWeatherOutput): void {
		this.form.patchValue({
			...obj,
		});
		this.cdr.markForCheck();
	}

	/**
	 * Called by angular with the form control value.
	 * @param fn Handler that notifies change to form controls.
	 */
	public registerOnChange(fn: (_: TCityWeatherOutput) => void): void {
		this.propagateChange = fn;
	}

	/**
	 * Empty function for on touched handler.
	 */
	public registerOnTouched(): void {
		/*Empty*/
	}

	/**
	 * Function to validate the component.
	 * @param control Control
	 */
	public validate(control: AbstractControl): ValidationErrors | null {
		return this.form.invalid ? { invalid: true } : null;
	}
	/**
	 * propagates changes.
	 */
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	private propagateChange = (_: TCityWeatherOutput) => {
		/*empty*/
	};
	/**
	 * Simulates a form submit.
	 * @private
	 */
	private orchestrateFormSubmit(): void {
		this.markAllDirty$?.subscribe(() => {
			this.form.markAllAsTouched();
			Object.keys(this.form.controls).forEach(controlName => {
				this.form.get(controlName)?.markAsDirty();
			});
			this.cdr.markForCheck();
		});
	}
}
