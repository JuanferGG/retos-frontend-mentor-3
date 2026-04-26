import { useEffect, useState } from "react";
import { getCoordinates } from "../api/axios";

export type Location = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

type LocationSearchProps = {
  onSearch: (location: Location) => void;
};

export const LocationSearch = ({ onSearch }: LocationSearchProps) => {
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
            setResults(res?.results || []);
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
    onSearch(selected); // 🔥 ahora envía TODO
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setHasSelected(false);
    setSelected(null);
  };

  return (
    <div className="input-container">
      <div className="autocomplete">
        <input
          className="inputP"
          type="text"
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
  );
};
