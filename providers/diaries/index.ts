import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { createDiaryEntryFormData } from "../../components/AddDiaryEntryBottomSheet";
import { updateTripFormData } from "../../components/UpdateTripBottomSheet";
import { API } from "../../config/api";
import axiosInstance from "../../config/axios";
import { getDiaryData } from "../../screens/MyDiaries";
import { getTripData } from "../../screens/MyTrips";

export default function useGetDiaries(
  token: string,
  tripId: number,
): UseQueryResult<getDiaryData[]> {
  const trips = useQuery({
    queryKey: ["all-diary"],
    queryFn: async () => {
      const response = await axiosInstance.get(API.GET_ALL_DIARIES(tripId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  return trips;
}

export function useGetTripById(
  tripId: number,
  token: string,
): UseQueryResult<getTripData> {
  const trip = useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const response = await axiosInstance.get(API.GET_TRIP_BY_ID(tripId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });

  return trip;
}

export function addDiary(
  diaryData: createDiaryEntryFormData,
  tripId: number,
  token: string,
) {
  return axiosInstance.post(
    API.CREATE_DIARY(tripId),
    {
      date: diaryData.date,
      location: diaryData.location,
      description: diaryData.description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export function updateTrip(
  tripId: number,
  tripData: updateTripFormData,
  token: string,
) {
  return axiosInstance.put(
    API.UPDATE_TRIP(tripId),
    {
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      status: tripData.status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export function removeDiary(tripId: number, diaryId: number, token: string) {
  return axiosInstance.delete(API.DELETE_DIARY(tripId, diaryId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
