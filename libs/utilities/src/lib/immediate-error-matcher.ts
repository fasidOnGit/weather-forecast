import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

/**
 * Error when invalid control is dirty, touched, or submitted
 */
export class ImmediateErrorStateMatcher implements ErrorStateMatcher {
	/**
	 * Provider that defines how form controls behave with regards to displaying error messages.
	 * @param control Form Control to alter error message behaviour
	 * @param form The form that is wrapping the form control
	 * @return Indicator to show if the control has to show error.
	 */
	public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}
