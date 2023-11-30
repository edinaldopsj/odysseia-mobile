import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { createTripFormData } from "../../components/AddTripBottomSheet";
import { updateTripFormData } from "../../components/UpdateTripBottomSheet";
import { API } from "../../config/api";
import axiosInstance from "../../config/axios";
import { getTripData } from "../../screens/MyTrips";

export default function useGetTrips(
  token: string,
): UseQueryResult<getTripData[]> {
  const trips = useQuery({
    queryKey: ["all-trips"],
    queryFn: async () => {
      const response = await axiosInstance.get(API.GET_ALL_TRIPS, {
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

export function addTrip(tripData: createTripFormData, token: string) {
  return axiosInstance.post(
    API.CREATE_TRIP,
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

export function removeTrip(tripId: number, token: string) {
  return axiosInstance.delete(API.DELETE_TRIP(tripId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
