import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { IDataGridColumn } from './data-grid.interface';

@Component({
	selector: 'ds-data-grid',
	templateUrl: './data-grid.component.html',
	styleUrls: ['./data-grid.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridComponent implements OnChanges {
	@Input() columns!: IDataGridColumn[];
	@Input() dataSource!: any;
	displayedColumns: string[];
	constructor() {
		this.displayedColumns = [];
	}

	ngOnChanges(): void {
		this.displayedColumns = this.columns.map(col => col.title);
	}
}
