import "./App.css";
import { useState } from "react";
import { DataWeather } from "./components/DataWeather";
import { Header } from "./components/Header";
import {
  LocationSearch,
  type CoordinatesParams,
} from "./components/LocationSearch";

function App() {
  const [paramsData, setParamsData] = useState({ latitude: 0, longitude: 0 })
  const handleLocationSearch = (params: CoordinatesParams) => {
    setParamsData(params)
    // console.log("Buscar clima con:", params);
  };

  return (
    <section className="containerP">
      <Header />

      <h1 className="titleP">How's the sky looking today?</h1>
      <LocationSearch onSearch={handleLocationSearch} />
      <DataWeather params={paramsData} />
    </section>
  );
}

export default App;
