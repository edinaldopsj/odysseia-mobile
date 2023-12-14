export const API = {
  // auth
  GET_ACCESS_CODE: "/auth/get-access-code",
  VALIDATE_ACCESS_CODE: "/auth/validate-access-code",

  // trips
  GET_ALL_TRIPS: "/trips",
  CREATE_TRIP: "/trips",
  GET_TRIP_BY_ID: (tripId: number) => `/trips/${tripId}`,
  UPDATE_TRIP: (tripId: number) => `/trips/${tripId}`,
  DELETE_TRIP: (tripId: number) => `/trips/${tripId}`,

  // diaries
  GET_ALL_DIARIES: (tripId: number) => `/diary/${tripId}`,
  CREATE_DIARY: (tripId: number) => `/diary/${tripId}`,
  GET_DIARY_BY_ID: (tripId: number, diaryId: number) =>
    `/diary/${tripId}/${diaryId}`,
  UPDATE_DIARY: (tripId: number, diaryId: number) =>
    `/diary/${tripId}/${diaryId}`,
  DELETE_DIARY: (tripId: number, diaryId: number) =>
    `/diary/${tripId}/${diaryId}`,
  UPDATE_DIARY_IMAGE: (tripId: number, diaryId: number) =>
    `/diary/${tripId}/${diaryId}`,
};
