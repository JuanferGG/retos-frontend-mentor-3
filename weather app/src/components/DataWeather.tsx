import { useEffect } from "react";
import type { CoordinatesParams } from "./LocationSearch";
import { fetchWeatherApi } from "openmeteo";

export const DataWeather = ({
  params: params,
}: {
  params: CoordinatesParams;
}) => {
  const { latitude, longitude } = params;

  const paramsFetch = {
    latitude: latitude,
    longitude: longitude,
    hourly: "temperature_2m",
    past_days: 0,
    forecast_days: 7,
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  
  const getData = async () => {
    const response = await fetchWeatherApi(url, paramsFetch)
    console.log(response[0])
  }

  useEffect(() => {
    if (paramsFetch.latitude === 0 && paramsFetch.longitude === 0) return
    getData()
  }, [paramsFetch])
  

  return (
    <div>
      <p>Location: New York</p>
    </div>
  );
};
