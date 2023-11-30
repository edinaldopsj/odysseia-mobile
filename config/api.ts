export const API = {
  GET_ACCESS_CODE: "/auth/get-access-code",
  VALIDATE_ACCESS_CODE: "/auth/validate-access-code",

  GET_ALL_TRIPS: "/trips",
  CREATE_TRIP: "/trips",
  DELETE_TRIP: (tripId: number) => `/trips/${tripId}`,
};
