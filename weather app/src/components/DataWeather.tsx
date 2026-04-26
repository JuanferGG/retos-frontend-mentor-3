import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";
import type { Location } from "./LocationSearch";

type CoordinatesParams = {
  latitude: number;
  longitude: number;
};

type WeatherData = {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    wind: number;
    precipitation: number;
    weatherCode: number;
  };
  hourly: {
    time: Date[];
    temperature: number[];
    weatherCode: number[];
  };
  daily: {
    time: Date[];
    max: number[];
    min: number[];
    weatherCode: number[];
  };
};

const weatherMap: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  61: "🌧️",
  71: "❄️",
};

export const DataWeather = ({ params, location }: { params: CoordinatesParams, location: Location | null }) => {
  const { latitude, longitude } = params;
  const [data, setData] = useState<WeatherData | null>(null);

  const url = "https://api.open-meteo.com/v1/forecast";

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchData = async () => {
      const response = await fetchWeatherApi(url, {
        latitude,
        longitude,
        current: [
          "temperature_2m",
          "apparent_temperature",
          "relative_humidity_2m",
          "wind_speed_10m",
          "precipitation",
          "weather_code",
        ],
        hourly: ["temperature_2m", "weather_code"],
        daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"],
        forecast_days: 7,
        timezone: "auto",
      });

      const res = response[0];

      // 🔹 CURRENT
      const current = res.current();
      const currentData = {
        temperature: Number(current.variables(0).value()),
        feelsLike: Number(current.variables(1).value()),
        humidity: Number(current.variables(2).value()),
        wind: Number(current.variables(3).value()),
        precipitation: Number(current.variables(4).value()),
        weatherCode: Number(current.variables(5).value()),
      };

      // 🔹 HOURLY
      const hourly = res.hourly();
      const hourlyLength =
        (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval();

      const hourlyTime = Array.from(
        { length: hourlyLength },
        (_, i) =>
          new Date((Number(hourly.time()) + i * hourly.interval()) * 1000),
      );

      const hourlyData = {
        time: hourlyTime,
        temperature: Array.from(hourly.variables(0).valuesArray()),
        weatherCode: Array.from(hourly.variables(1).valuesArray()),
      };

      // 🔹 DAILY
      const daily = res.daily();
      const dailyLength =
        (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval();

      const dailyTime = Array.from(
        { length: dailyLength },
        (_, i) =>
          new Date((Number(daily.time()) + i * daily.interval()) * 1000),
      );

      const dailyData = {
        time: dailyTime,
        max: Array.from(daily.variables(0).valuesArray()),
        min: Array.from(daily.variables(1).valuesArray()),
        weatherCode: Array.from(daily.variables(2).valuesArray()),
      };

      setData({
        current: currentData,
        hourly: hourlyData,
        daily: dailyData,
      });
    };

    fetchData();
  }, [latitude, longitude]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="weather-container">
      {/* 🔥 CURRENT */}
      <div className="current">
        <p className="location">{`${location.name}, ${location.country}`}</p>
        <p>{weatherMap[data.current.weatherCode]}</p>
        <h2>{Math.round(data.current.temperature)}°</h2>
      </div>

      {/* 🔥 METRICS */}
      <div className="metrics">
        <p>Feels like: {Math.round(data.current.feelsLike)}°</p>
        <p>Humidity: {Math.round(data.current.humidity)}%</p>
        <p>Wind: {Math.round(data.current.wind)} km/h</p>
        <p>Precipitation: {Math.round(data.current.precipitation)} mm</p>
      </div>

      {/* 🔥 DAILY */}
      <div className="daily">
        <h3>7-Day Forecast</h3>
        {data.daily.time.map((day, i) => (
          <div key={i}>
            <p>{day.toLocaleDateString()}</p>
            <p>
              {Math.round(data.daily.max[i])}° / {Math.round(data.daily.min[i])}
              °
            </p>
            <p>{weatherMap[data.daily.weatherCode[i]]}</p>
          </div>
        ))}
      </div>

      {/* 🔥 HOURLY */}
      {/* <div className="hourly">
        <h3>Hourly</h3>
        {data.hourly.time.slice(0, 12).map((time, i) => (
          <div key={i}>
            <p>{time.getHours()}:00</p>
            <p>{Math.round(data.hourly.temperature[i])}°</p>
            <p>{weatherMap[data.hourly.weatherCode[i]]}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};
