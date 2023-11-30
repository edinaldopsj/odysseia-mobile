export const API = {
  // auth
  GET_ACCESS_CODE: "/auth/get-access-code",
  VALIDATE_ACCESS_CODE: "/auth/validate-access-code",

  // trips
  GET_ALL_TRIPS: "/trips",
  GET_TRIP_BY_ID: (tripId: number) => `/trips/${tripId}`,
  CREATE_TRIP: "/trips",
  UPDATE_TRIP: (tripId: number) => `/trips/${tripId}`,
  DELETE_TRIP: (tripId: number) => `/trips/${tripId}`,
};
