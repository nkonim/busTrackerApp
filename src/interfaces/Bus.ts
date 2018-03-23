export interface Bus {
    name?: string;
    start?: string;
    end?: string;
    route?:string;
    seats?: string | number;
    tracking?: string;
    endLat?:number;
    endLon?:number;
}