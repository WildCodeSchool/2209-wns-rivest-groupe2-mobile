export interface IPOIData {
    id: number;
    name: string;
    address: string;
    postal: string;
    type: string;
    coordinates: LatLngExpression;
    pictureUrl: string;
    websiteURL: string;
    description: string;
    creationDate: string;
    priceRange: string;
    city: string;
    daysOpen: string[];
    hoursOpen: string[];
    hoursClose: string[];
  }
  