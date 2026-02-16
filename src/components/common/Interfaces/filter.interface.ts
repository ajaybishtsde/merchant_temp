export interface FilterCancelTripReason {
  reason?: string | undefined;
  isActive?: boolean | undefined;
}

export interface FilterAdminQuery {
  name?: string | undefined;
  email?: string | undefined;
  isActive?: boolean | undefined;
}

export interface FilterAppVersion {
  versionNumber?: number;
}

export interface FilterNeighborQuery {
  name?: string | undefined;
  cityId?: number | undefined;
  stateId?: number | undefined;
  isActive?: boolean | undefined;
}

export interface FilterDashboardQuery {
  startDate?: string | undefined;
  endDate?: string | undefined;
}

export interface FilterHotspotQuery {
  googlePlaceName?: string | undefined;
  neighborhood?: string | undefined;
  isActive?: boolean | undefined;
}

export interface FilterReportQuery {
  status?: string | undefined;
  reportedUser?: string;
  reporter?: string;
}

export interface FilterInterestQuery {
  search?: string | undefined;
}
