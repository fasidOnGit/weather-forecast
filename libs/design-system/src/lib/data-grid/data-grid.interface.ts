export interface IDataGridColumn {
	title: string;
	property: string;
	label: string;
	valueTransformer?: (value: any, property: string) => any;
}
