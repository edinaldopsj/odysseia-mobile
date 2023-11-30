import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { createTripFormData } from "../../components/AddTripBottomSheet";
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

export function addTrip(tripData: createTripFormData, token: string) {
  return axiosInstance.post(
    API.CREATE_TRIP,
    {
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
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
