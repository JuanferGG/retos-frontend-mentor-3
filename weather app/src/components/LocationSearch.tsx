import { useEffect, useState } from "react";
import { getCoordinates } from "../api/axios";

type Location = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type CoordinatesParams = {
  latitude: number;
  longitude: number;
};

type LocationSearchProps = {
  onSearch: (params: CoordinatesParams) => void;
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

    onSearch({
      latitude: selected.latitude,
      longitude: selected.longitude,
    });
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
  );
};
