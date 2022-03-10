import { Pipe, PipeTransform } from '@angular/core';
import { IDataGridColumn } from '../data-grid.interface';

/**
 * The pipe that applies a value transform to an object.
 */
@Pipe({ name: 'valueTransformer' })
export class ValueTransformerPipe implements PipeTransform {
	/**
	 * PipeTransform.
	 */
	public transform(value: any, column: IDataGridColumn): any {
		let tranformed: any = value;
		if (column && column.property && column.valueTransformer) {
			tranformed = column.valueTransformer(value, column.property);
		}
		return tranformed;
	}
}
