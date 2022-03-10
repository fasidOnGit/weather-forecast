/**
 * Interface for the 'City' weather data
 */
export interface CityEntity {
	name: string;
	local_names: Record<string, string>;
	lat: number;
	lon: number;
	country: string;
	state: string;
}
