export interface UserQueryDto {
  name?: string;
  phoneNumber?: number;
}

export interface PaginationQueryDto {
  page?: number;
  size?: number;
  isDeleted?: boolean;
}

export interface CancelTripQueryDto extends PaginationQueryDto {
  isActive?: boolean;
  reasons?: string;
}

export interface ActiveFilterDto {
  isActive?: boolean;
}

export interface versionHistoryFilterDto {
  isForceUpdateRequiredForAndroid?: boolean;
  isForceUpdateRequiredForIos?: boolean;
}

export interface DriverFaqDto {
  title?: string;
  description?: string;
}

export interface PassengerFaqDto {
  title?: string;
  description?: string;
}
