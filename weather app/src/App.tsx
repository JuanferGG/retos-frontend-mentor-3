import "./App.css";
import { Header } from "./components/Header";
import { useEffect, useState } from "react";
import { getCoordinates } from "./api/axios";

type Location = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);
  const [hasSelected, setHasSelected] = useState(false);

  useEffect(() => {
    if (hasSelected) return;

    const timeout = setTimeout(() => {
      if (query.length > 2) {
        getCoordinates(query)
          .then((res) => {
            setResults(res.results || []);
          })
          .catch(console.error);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, hasSelected]);

  const handleSelect = (item: Location) => {
    setSelected(item);
    setQuery(`${item.name}, ${item.country}`);
    setResults([]);
    setHasSelected(true);
  };

  const handleSearch = () => {
    if (!selected) return;

    const params = {
      latitude: selected.latitude,
      longitude: selected.longitude,
    };

    console.log("Buscar clima con:", params);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setHasSelected(false);
  };

  return (
    <section className="containerP">
      <Header />

      <h1 className="titleP">How's the sky looking today?</h1>

      <div className="input-container">
        <div className="autocomplete">
          <input
            className="inputP"
            type="text"
            id="inputP"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="🔍︎ Search for a place..."
          />

          {results.length > 0 && (
            <ul className="dropdownSearch">
              {results.map((item, i) => (
                <li key={i} onClick={() => handleSelect(item)}>
                  {item.name}, {item.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="btnP" onClick={handleSearch}>
          Search
        </button>
      </div>
    </section>
  );
}

export default App;
