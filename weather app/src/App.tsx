import "./App.css";
import { useState } from "react";
import { DataWeather } from "./components/DataWeather";
import { Header } from "./components/Header";
import { LocationSearch, type Location } from "./components/LocationSearch";

function App() {
  const [location, setLocation] = useState<Location | null>(null);

  const handleLocationSearch = (loc: Location) => {
    setLocation(loc);
  };

  return (
    <section className="containerP">
      <Header />

      <h1 className="titleP">How's the sky looking today?</h1>

      <LocationSearch onSearch={handleLocationSearch} />

      {location && (
        <>
          <DataWeather
            location={location}
            params={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        </>
      )}
    </section>
  );
}

export default App;
