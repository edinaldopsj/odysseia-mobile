import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { createDiaryEntryFormData } from "../../components/AddDiaryEntryBottomSheet";
import { updateDiaryEntryFormData } from "../../components/UpdateDiaryEntryBottomSheet";
import { updateTripFormData } from "../../components/UpdateTripBottomSheet";
import { API } from "../../config/api";
import axiosInstance from "../../config/axios";
import { getDiaryData } from "../../screens/MyDiaries";

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

export function useGetDiaryById(
  tripId: number,
  diaryId: number,
  token: string,
): UseQueryResult<getDiaryData> {
  const trip = useQuery({
    queryKey: ["diary", tripId, diaryId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        API.GET_DIARY_BY_ID(tripId, diaryId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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

export function updateDiaryImage(
  tripId: number,
  diaryId: number,
  token: string,
  imgFile: {
    uri: string;
    type: string | undefined;
    name: string;
  },
) {
  const formData = new FormData();
  formData.append("file", imgFile as any);

  return axiosInstance.patch(
    API.UPDATE_DIARY_IMAGE(tripId, diaryId),
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

export function updateDiary(
  diaryId: number,
  diaryData: updateDiaryEntryFormData,
  tripId: number,
  token: string,
) {
  return axiosInstance.put(
    API.UPDATE_DIARY(tripId, diaryId),
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
