
export const weatherMap: Record<number, string> = {
  // ☀️ Clear / Clouds
  0: "☀️", // Clear sky
  1: "🌤️", // Mainly clear
  2: "⛅", // Partly cloudy
  3: "☁️", // Overcast

  // 🌫️ Fog
  45: "🌫️", // Fog
  48: "🌫️", // Depositing rime fog

  // 🌦️ Drizzle
  51: "🌦️", // Light drizzle
  53: "🌦️", // Moderate drizzle
  55: "🌦️", // Dense drizzle

  // 🌧️ Freezing drizzle
  56: "🌧️",
  57: "🌧️",

  // 🌧️ Rain
  61: "🌧️", // Slight rain
  63: "🌧️", // Moderate rain
  65: "🌧️", // Heavy rain

  // 🌧️ Freezing rain
  66: "🌧️",
  67: "🌧️",

  // ❄️ Snow
  71: "❄️", // Slight snow
  73: "❄️", // Moderate snow
  75: "❄️", // Heavy snow

  // 🌨️ Snow grains
  77: "🌨️",

  // 🌦️ Rain showers
  80: "🌦️",
  81: "🌦️",
  82: "🌧️",

  // ❄️ Snow showers
  85: "❄️",
  86: "❄️",

  // ⛈️ Thunderstorm
  95: "⛈️", // Thunderstorm
  96: "⛈️", // Thunderstorm + hail
  99: "⛈️", // Thunderstorm heavy hail
};