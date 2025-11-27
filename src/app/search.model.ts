export interface searchInterface {
    target_city: string,
    target_city_iata_code: string,
    origin_country: string,
    origin_country_code: string,
    departure_city: string,
    departure_city_iata_code: string,
    adult: number,
    departure_date: string,
    return_date: string,

    selectedFlight?: {
        selected:boolean;
        from: string;
        to: string;
        name: string;
        price: string;
    };

    selectedHotel?: {
        selected:boolean;
        name: string;
        nights: number;
        latitude: number;
        longitude: number;
    };
}