import "./assets/css/style.css";

const loader = document.querySelector('.loader');
const searchInput = document.querySelector('.search-input');
const searchCityBtn = document.querySelector('.search-city-btn');
const searchHereBtn = document.querySelector('.search-here-btn');

const unitSwitch = document.querySelector('.unit-switch');
const unitCheckbox = document.querySelector('.unit-checkbox');
const unitC = document.querySelector('.unit-c');
const unitF = document.querySelector('.unit-f');

const locationName = document.querySelector('.location-name');
const weatherDescription = document.querySelector('.weather-description');
const temperatureValue = document.querySelector('.temperature-value');
const temperatureUnit = document.querySelectorAll('.temperature-unit');
const minTemperature = document.querySelector('.min-temperature');
const maxTemperature = document.querySelector('.max-temperature');

const API_KEY = 'e24777d55aaff3d179ae147424695333';

function getWeather(input) {
  loader.classList.add('display');
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
      loader.classList.remove('display');
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
  loader.classList.add('display');
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
      loader.classList.remove('display');
      locationName.textContent = "Location service is not available for this browser. Try searching by the city name."
    });
});

function renderWeather(data) {
  locationName.textContent = `${data.name}, ${data.sys.country}`;
  weatherDescription.textContent = data.weather[0].description;
  temperatureValue.textContent = `${Math.round(convertToUnit(data.main.temp))}`;
  minTemperature.textContent = `min ${Math.round(convertToUnit(data.main.temp_min))}`;
  maxTemperature.textContent = `max ${Math.round(convertToUnit(data.main.temp_max))}`;
}

function convertToUnit(tempC) {

  if(unitCheckbox.checked) {
    temperatureUnit.forEach(unit => unit.textContent = "°C");
    return tempC
  }
  else {
    temperatureUnit.forEach(unit => unit.textContent = "°F");
    return ((tempC * 9/5) + 32);
  }
}

unitSwitch.addEventListener('click', () => {
  if(unitCheckbox.checked) {
    unitC.classList.add('active-unit');
    unitF.classList.remove('active-unit');
  }
  else {
    unitC.classList.remove('active-unit');
    unitF.classList.add('active-unit');
  }
  getWeather(locationName.textContent);
})