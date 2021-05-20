import './assets/css/style.css';

const loader = document.querySelector('.loader');
const backdrop = document.querySelector('.backdrop');
const warningMessage = document.querySelector('.warning-message');
const searchInput = document.querySelector('.search-input');
const searchCityBtn = document.querySelector('.search-city-btn');
const searchHereBtn = document.querySelector('.search-here-btn');
const weatherCard = document.querySelector('.weather-card');
const unitSwitch = document.querySelector('.unit-switch');
const unitCheckbox = document.querySelector('.unit-checkbox');
const unitC = document.querySelector('.unit-c');
const unitF = document.querySelector('.unit-f');
const locationName = document.querySelector('.location-name');
const weatherIcon = document.querySelector('.weather-icon');
const weatherDescription = document.querySelector('.weather-description');
const temperatureValue = document.querySelector('.temperature-value');
const temperatureUnit = document.querySelectorAll('.temperature-unit');
const minTemperature = document.querySelector('.min-temperature');
const maxTemperature = document.querySelector('.max-temperature');

const GIF_URL = 'https://raw.githubusercontent.com/brenoxav/project-assets/gh-pages/weather-gifs/';
const ICON_URL = 'https://raw.githubusercontent.com/brenoxav/project-assets/gh-pages/weather-icons/';
const API_KEY = 'e24777d55aaff3d179ae147424695333';

const convertToUnit = (tempC) => {
  if (unitCheckbox.checked) {
    temperatureUnit.forEach((unit) => { unit.textContent = '°C'; });
    return tempC;
  }
  temperatureUnit.forEach((unit) => { unit.textContent = '°F'; });
  return (((tempC * 9) / 5) + 32);
};

const renderWeather = (data) => {
  locationName.textContent = `${data.name}, ${data.sys.country}`;
  weatherCard.style.backgroundImage = `url('${GIF_URL}${data.weather[0].icon}.gif')`;
  weatherIcon.style.backgroundImage = `url('${ICON_URL}${data.weather[0].icon}.svg')`;
  weatherDescription.textContent = data.weather[0].description;
  temperatureValue.textContent = `${Math.round(convertToUnit(data.main.temp))}`;
  minTemperature.textContent = `${Math.round(convertToUnit(data.main.temp_min))}`;
  maxTemperature.textContent = `${Math.round(convertToUnit(data.main.temp_max))}`;
};

const getWeather = (input) => {
  warningMessage.innerHTML = '';
  backdrop.classList.add('display');
  loader.classList.add('display');
  let url = '';
  if (typeof input === 'string') {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${API_KEY}`;
  } else if (typeof input === 'object') {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${input.lat}&lon=${input.lon}&units=metric&appid=${API_KEY}`;
  }
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      backdrop.classList.remove('display');
      loader.classList.remove('display');
      renderWeather(data);
    })
    .catch(() => {
      backdrop.classList.add('display');
      warningMessage.innerHTML = `
      <p class="warning-message">LOCATION NOT FOUND</p>
      </br>
      <p class="warning-message">Click the pin icon above to use you current location OR type a city name in the search field.</p>
      `;
    });
};

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getWeather(searchInput.value);
  }
});

searchCityBtn.addEventListener('click', () => {
  getWeather(searchInput.value);
});

const getCurrentLocation = () => {
  backdrop.classList.add('display');
  loader.classList.add('display');
  const options = {
    timeout: 5000,
  };
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

searchHereBtn.addEventListener('click', () => {
  getCurrentLocation()
    .then((geo) => getWeather({ lat: geo.coords.latitude, lon: geo.coords.longitude }))
    .catch(() => {
      backdrop.classList.add('display');
      loader.classList.remove('display');
      warningMessage.innerHTML = `
      <p class="warning-message">LOCATION SERVICE IS NOT AVAILABLE FOR THIS BROWSER</p>
      </br>
      <p class="warning-message">Either give permission for this site to use your geolocation OR use the search field.</p>
      `;
    });
});

unitSwitch.addEventListener('click', () => {
  if (unitCheckbox.checked) {
    unitC.classList.add('active-unit');
    unitF.classList.remove('active-unit');
  } else {
    unitC.classList.remove('active-unit');
    unitF.classList.add('active-unit');
  }
  getWeather(locationName.textContent);
});
