import axios from "axios";


export const getCoordinates = async (city: string) => {
    if (!city || city.trim() === "") {
      return null
    }

  const res = await axios.get(
    "https://geocoding-api.open-meteo.com/v1/search",
    {
      params: {
        name: city,
        count: 8,
        language: "es",
        format: "json",
      },
    }
  );

  return res.data
};
