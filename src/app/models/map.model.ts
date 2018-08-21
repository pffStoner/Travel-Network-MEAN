import { Waypoint } from './waypoints.model';


export class Map {
    constructor(public orign: {
        lat: number
        lng: number
    },
        public destination: {
            lat: number,
            lng: number,
        },
        public waypoint: Waypoint[],
        public locations: [{
            location: string
        }],
        public markers: [{
            coords: {
                lat: number,
                lng: number,
            }
        }]
    ) { }
}
