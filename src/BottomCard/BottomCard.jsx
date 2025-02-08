import { IoPartlySunnyOutline } from "react-icons/io5";
import "./BottomCard.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const BottomCard = ({ city }) => {
  const [forcast, setForecast] = useState([]);

  useEffect(() => {
    const search = async () => {
      try {
        if (!city) return;

        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${
          import.meta.env.VITE_API_ID
        }&units=metric`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (data.list && data.list.length > 0) {
          const today = new Date().toISOString().split("T")[0];

          const filteredForecast = data.list
            .filter((item) => !item.dt_txt.startsWith(today)) // Remove today's data
            .reduce((acc, curr) => {
              const date = new Date(curr.dt * 1000);
              const day = date.getDate();
              const hour = date.getHours();

              // ✅ **Prioritize 12:00 PM Forecast**
              if (
                !acc[day] ||
                Math.abs(hour - 12) < Math.abs(acc[day].hour - 12)
              ) {
                acc[day] = { ...curr, hour };
              }
              return acc;
            }, {});
          const formattedForecast = Object.values(filteredForecast)
            .slice(0, 5) // Limit to 5 days
            .map((item) => {
              const dateObj = new Date(item.dt * 1000);
              return {
                day: dateObj.toLocaleDateString("en-US", { weekday: "long" }),
                temperature: Math.round(item.main.temp),
                icon: item.weather[0].icon, // Ensure correct icon
              };
            });

          setForecast(formattedForecast);
        }
      } catch (error) {
        console.error("Encountering error: ", error);
      }
    };

    search();
  }, [city]);

  return (
    <div className="Bmain">
      <div className="bottom">
        {forcast.map((day, index) => (
          <div className="cardSmall" key={index}>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt="Weather Icon"
            />
            <p>{day.temperature}°C</p>
            <p>{day.day}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
BottomCard.propTypes = {
  city: PropTypes.string.isRequired,
};
export default BottomCard;
