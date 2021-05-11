import "./assets/css/style.css";

const searchInput = document.querySelector('.search-input');
const searchCityBtn = document.querySelector('.search-city-btn');
const searchHereBtn = document.querySelector('.search-here-btn');

const locationName = document.querySelector('.location-name');
const weatherDescription = document.querySelector('.weather-description');
const temperature = document.querySelector('.temperature');
const minTemperature = document.querySelector('.min-temperature');
const maxTemperature = document.querySelector('.max-temperature');

const API_KEY = 'e24777d55aaff3d179ae147424695333';

function getWeather(input) {
  let url = '';
  if(typeof input === 'string'){
    url = `http://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${API_KEY}`;
  }
  else if(typeof input === 'object') {
    url = `http://api.openweathermap.org/data/2.5/weather?lat=${input.lat}&lon=${input.lon}&units=metric&appid=${API_KEY}`
  }
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      renderWeather(data);
    })
    .catch(err => {
      console.log(err);
      locationName.textContent = "Location not found!"
    });
}

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getWeather(searchInput.value)
  }
})

searchCityBtn.addEventListener('click', () => {
  getWeather(searchInput.value)
});

function getCurrentLocation() {
  const options = {
    timeout: 5000
  }
  //if(navigator.geolocation)
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  })  
}

searchHereBtn.addEventListener('click', () => {
  getCurrentLocation()
    .then(geo => getWeather({lat: geo.coords.latitude, lon: geo.coords.longitude}))
    .catch(err => {
      console.error(`ERROR GETTING COORDINATES: ${err.code}: ${err.message}`)
      locationName.textContent = "Location service is not available for this browser. Try searching by the city name."
    });
});

function renderWeather(data) {
  locationName.textContent = `${data.name}, ${data.sys.country}`;
  weatherDescription.textContent = data.weather[0].description;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  minTemperature.textContent = `min ${Math.round(data.main.temp_min)}°C`;
  maxTemperature.textContent = `max ${Math.round(data.main.temp_max)}°C`;
}
