const API_KEY = "167a6fab9a36493bf5a07eff4b9bf838";

function getWeather() {
  const city = document.getElementById("cityInput").value;
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ro`)
    .then(res => res.json())
    .then(data => {
      showWeather(data);
      getForecast(city);
    });
}

function getWeatherByLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ro`)
      .then(res => res.json())
      .then(data => {
        showWeather(data);
        getForecast(data.name);
      });
  });
}

function showWeather(data) {
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const info = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="${iconUrl}" alt="icon">
    <p>${data.weather[0].description}, ${data.main.temp}°C</p>
    <p>💨 ${data.wind.speed} m/s | 💧 ${data.main.humidity}%</p>
  `;
  document.getElementById("weatherInfo").innerHTML = info;
  showNotification(`Vremea în ${data.name}: ${data.weather[0].description}, ${data.main.temp}°C`);
}

function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ro`)
    .then(res => res.json())
    .then(data => {
      let forecastHTML = "<h3>Prognoză 5 zile:</h3>";
      for (let i = 0; i < data.list.length; i += 8) {
        const item = data.list[i];
        const date = new Date(item.dt_txt).toLocaleDateString();
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        forecastHTML += `
          <div>
            <h4>${date}</h4>
            <img src="${icon}" alt="icon">
            <p>${item.weather[0].description}, ${item.main.temp}°C</p>
          </div>
        `;
      }
      document.getElementById("weatherInfo").innerHTML += forecastHTML;
    });
}

function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
    loadSavedCities();
  }
}

function loadSavedCities() {
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  const html = cities.map(c => `<li onclick="getWeatherSaved('${c}')">${c}</li>`).join("");
  document.getElementById("savedCities").innerHTML = `<ul>${html}</ul>`;
}

function getWeatherSaved(city) {
  document.getElementById("cityInput").value = city;
  getWeather();
}

function askNotificationPermission() {
  Notification.requestPermission().then(p => {
    if (p === "granted") {
      showNotification("Permisiune activată pentru notificări!");
    }
  });
}

function showNotification(text) {
  if (Notification.permission === "granted") {
    new Notification("Meteo", {
      body: text,
      icon: "icon-192.jpg"
    });
  }
}

loadSavedCities();
