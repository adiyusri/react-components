import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(8);

  useEffect(() => {
    const request_headers = new Headers();
    const api_key = "sjPXII2NGFTrjCoA6HmeFMlN2XjCGbCdDO9sgu3E";
    request_headers.append("Authorization", `Bearer ${api_key}`);
    request_headers.append("Content-Type", "application/json");

    const request_options = {
      method: "GET",
      headers: request_headers,
    };

    fetch("https://countryapi.io/api/all", request_options)
    .then((res) => res.json())
    .then(
      (result) => {
        setLoaded(true);
        setItems(result);
      }, 
      (error) => {
        setLoaded(true);
        setError(error);
      }
    );
  }, []);

  const data = Object.values(items);

  const search_parameters = Object.keys(Object.assign({}, ...data));

  const filter_items = [...new Set(data.map((item) => item.region))];

  const load_more = (event) => {
    setPage((prevValue) => prevValue + 8);
  };

  function search(items) {
    return items.filter((item) =>
      item.region.includes(filter) && search_parameters.some((parameter) => 
        item[parameter].toString().toLowerCase().includes(query)
      )
    );
  }

  if (error) {
    return <>{error.message}</>;
  } else if (!loaded) {
    return <>loading...</>;
  } else {
    return (
      <div className="wrapper">
        <div className="header">
        <div className="search-wrapper">
          <label htmlFor="search-form">
            <input
              type="search"
              name="search-form"
              id="search-form"
              className="search-input"
              placeholder="Search for..."
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="sr-only">Search country here</span>
          </label>
        </div>
        <div className="select">
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="custom-select"
            aria-label="Filter Countries by Region"
          >
            <option value="">Filter by Region</option>
            {filter_items.map((item) => (
              <option value={item}>Filter by {item}</option>
            ))}
          </select>
          <span className="focus"></span>
        </div>
        </div>
        <ul className="card-grid">
          {search(data).slice(0,page).map((item) => (
            <li key={item.alpha3Code}>
              <article className="card">
                <div className="card-image">
                  <img src={item.flag.large} alt={item.name}/>
                </div>
                <div className="card-content">
                  <h2 className="card-name">{item.name}</h2>
                  <ol className="card-list">
                                        <li>
                                            Population:{" "}
                                            <span>{item.population}</span>
                                        </li>
                                        <li>
                                            Region: <span>{item.region}</span>
                                        </li>
                                        <li>
                                            Capital: <span>{item.capital}</span>
                                        </li>
                                    </ol>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <button onClick={load_more}>Load More</button>
      </div>
    );
  }
}

export default App;