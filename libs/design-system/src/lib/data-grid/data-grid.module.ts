import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGridComponent } from './data-grid.component';
import { ValueTransformerModule } from './value-transformer/value-transformer.module';
import { MatTableModule } from '@angular/material/table';

@NgModule({
	imports: [CommonModule, ValueTransformerModule, MatTableModule],
	exports: [DataGridComponent],
	declarations: [DataGridComponent],
})
export class DataGridModule {}
