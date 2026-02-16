export interface MongoResponse {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum IsActiveFilter {
  Active = 'Active',
  InActive = 'InActive',
}

export interface AdminPopulateResponse {
  _id: string;
  email: string;
  name: string;
}
