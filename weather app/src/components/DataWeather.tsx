import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";
import { weatherMap } from "./WheaterMap";
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

export const DataWeather = ({
  params,
  location,
}: {
  params: CoordinatesParams;
  location: Location | null;
}) => {
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
      <div className="weather-data-left">
        {/* CURRENT */}
        <div className="current">
          <div className="location-time">
            <p className="location">{`${location.name}, ${location.country}`}</p>
            <p className="time">{new Date().toUTCString()}</p>
          </div>
          <h2 className="temperature">
            {weatherMap[data.current.weatherCode]}
            {Math.round(data.current.temperature)}°
          </h2>
        </div>

        {/* METRICS */}
        <div className="metrics">
          <div className="metric">
            <h2>Feels like</h2>
            <p>{Math.round(data.current.feelsLike)}°</p>
          </div>
          <div className="metric">
            <h2>Humidity</h2>
            <p>{Math.round(data.current.humidity)}%</p>
          </div>
          <div className="metric">
            <h2>Wind</h2>
            <p>{Math.round(data.current.wind)}km/h</p>
          </div>
          <div className="metric">
            <h2>Precipitation</h2>
            <p>{Math.round(data.current.precipitation)}mm</p>
          </div>
        </div>

        {/* DAILY */}
        <div className="daily">
          <h3 className="title">Day Forecast</h3>
          <div className="daily-container">
            {data.daily.time.map((day, i) => (
              <div key={i} className="block-day">
                <p>{day.toLocaleDateString("en-US", { weekday: "long" })}</p>
                <p className="icon-day">
                  {weatherMap[data.daily.weatherCode[i]]}
                </p>
                <div className="temp-min-max">
                  <p>{Math.round(data.daily.max[i])}°</p>
                  <p>{Math.round(data.daily.min[i])}°</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="weather-data-right">
        {/* HOURLY */}
        <div className="hourly">
          <h3 className="title">Hourly</h3>
          <div className="hourly-container">
            {data.hourly.time.slice(0, 12).map((time, i) => (
              <div key={i} className="block-hour">
                <div className="icon-hour">
                  <p className="icon">{weatherMap[data.hourly.weatherCode[i]] || "🌤️"}</p>
                  <p>{time.getHours()} {time.getHours() >= 12 ? "PM" : "AM"}</p>
                </div>
                <p className="hourly-grades">{Math.round(data.hourly.temperature[i])}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
