import { useEffect, useRef, useState } from "react";
import "./App.css";
import { IoSearch } from "react-icons/io5";
import BottomCard from "./BottomCard/BottomCard";
import { FiCloudLightning } from "react-icons/fi";
import { IoWaterOutline } from "react-icons/io5";
import { TbWind } from "react-icons/tb";
import { PiHeadlights } from "react-icons/pi";
import { TbUvIndex } from "react-icons/tb";
import { WiSmog } from "react-icons/wi";
import clearIconD from "../src/assets/clear_D.png";
import clearIconN from "../src/assets/clear_N.png";
import cloudIconD from "../src/assets/cloud_D.png";
import cloudIconN from "../src/assets/Cloud_N.png";
import drizzleIconD from "../src/assets/drizzle_D.png";
import drizzleIconN from "../src/assets/drizzle_N.png";
import rainIconD from "../src/assets/rain_D.png";
import rainIconN from "../src/assets/rain_N.png";
import snowIconD from "../src/assets/snow_D.png";
import snowIconN from "../src/assets/snow_N.png";

function App() {
  const inputRef = useRef();
  const [city, setCity] = useState("Berlin");
  const [climate, setClimate] = useState(false);

  const [uvIndex, setUvIndex] = useState(null);
  const [aqi, setAqi] = useState(null);

  const allIcons = {
    "01d": clearIconD,
    "01n": clearIconN,
    "02d": cloudIconD,
    "02n": cloudIconN,
    "03d": cloudIconD,
    "03n": cloudIconN,
    "04d": drizzleIconD,
    "04n": drizzleIconN,
    "09d": rainIconD,
    "09n": rainIconN,
    "10d": rainIconD,
    "10n": rainIconN,
    "11d": rainIconD,
    "11n": rainIconN,
    "13d": snowIconD,
    "13n": snowIconN,
  };

  const Search = async (searchCity) => {
    try {
      setCity(searchCity);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${
        import.meta.env.VITE_API_ID
      }&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setClimate({
        temperature: Math.floor(data.main.temp),
        place: data.name,
        country: data.sys.country,
        sky2: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        feel: Math.floor(data.main.feels_like),
        icon: icon, // ✅ Store the weather icon
      });

      fetchUVIndex(lat, lon); // ✅ Fetch UV Index
      fetchAQI(lat, lon); // ✅ Fetch AQI
    } catch (error) {
      console.error("Encountered Error:", error);
    }
  };
  const fetchUVIndex = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${
        import.meta.env.VITE_API_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();
      setUvIndex(data.value);
    } catch (error) {
      console.error("Error fetching UV Index:", error);
    }
  };

  const fetchAQI = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${
        import.meta.env.VITE_API_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();

      const aqiValue = data.list[0].main.aqi; // ✅ Extract AQI level (1-5 scale)
      setAqi(aqiValue);
    } catch (error) {
      console.error("Error fetching AQI:", error);
    }
  };
  useEffect(() => {
    Search("Pune");
  }, []);
  return (
    <>
      <div className="main">
        <div className="fullFrame">
          <div className="top">
            <div className="wtype">
              <div className="inSearch">
                <input ref={inputRef} type="text" placeholder=" Search..." />
                <button onClick={() => Search(inputRef.current.value)}>
                  <IoSearch color="white" size={25} />
                </button>
              </div>
              <div className="main_icon">
                <img src={climate.icon} alt="Weather Icon" />
                <h3>{climate.sky2?.toUpperCase()}</h3>
              </div>
              <div className="data">
                <h1 className="temp">{climate.temperature} °C</h1>
                <h3>Feel's like: {climate.feel} °C</h3>

                <div className="weather-icon"></div>
                <h1>
                  {climate.place} [{climate.country}]
                </h1>
              </div>
            </div>
          </div>
          <div className="stack">
            <h2>Today's Highlights</h2>
            <div className="today">
              <div className="today_humid">
                <p>Humidty</p>
                <IoWaterOutline color="#0d94f4e4" size={50} />
                <h2>{climate.humidity}%</h2>
              </div>
              <div className="today_wind">
                <p>Wind Speed</p>
                <TbWind color="#0d94f4e4" size={50} />
                <h2>{climate.wind} km/h</h2>
              </div>
              {/* <div className="today_vis">
                <p>Visibility </p>
                <PiHeadlights size={60} />
                <h2>10000</h2>
              </div> */}
              <div className="today_uv">
                <p>UV-Index</p>
                <TbUvIndex color="#0d94f4e4" size={60} />
                <h2>{uvIndex}</h2>
              </div>
              <div className="today_aqi">
                <p>AQI</p>
                <WiSmog color="#0d94f4e4" size={60} />
                <h2>{aqi}</h2>
              </div>
            </div>
            <h2 className="sp">Weekly Forecast </h2>
            <div className="Dforcast">
              <BottomCard city={city} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
