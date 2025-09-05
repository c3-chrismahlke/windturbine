export interface Manufacturer {
  name: string;
  country: string;
}

export interface WindTurbine {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  manufacturer: Manufacturer;
  builtDate: string;
  installationDate: string;
  active: boolean;
  ratedCapacityKW: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
