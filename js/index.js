const getElement = (id) => document.getElementById(id);

const city = getElement('current-city');
const humidity = getElement('current-humidity');
const pressure = getElement('current-pressure');
const temperature = getElement('current-temperature');
const windSpeed = getElement('current-wind-speed');
const summary = getElement('current-weather-summary');
const microphone = getElement('microphone');

const getWeatherButton = getElement('getCurrentWeather');

const requiredCity = getElement('required-city');
const getRequiredWeather = getElement('getRequiredWeather');

const error = getElement('error-info');
const closeError = getElement('error-close');

const loadingElem = getElement('loading');
let loading;

const weatherAPI = 'f99657535e4042513e47effacfb921b2';

const mathRound = (temp) => Math.round(temp);

const celciumTemprerature = (data) => data.main.temp - 273.15;

const getCurrentLocation = () => {

    city.innerHTML = "";
    humidity.innerHTML = "";
    pressure.innerHTML = "";
    temperature.innerHTML = "";
    windSpeed.innerHTML = "";
    summary.innerHTML = "";

    loadingElem.style.display = "block";

    navigator.geolocation.getCurrentPosition((position) => {
        getGeoData(position.coords.latitude, position.coords.longitude);
    });
};

const getGeoData = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPI}`)
        .then(response => response.json())
        .then(data => displayGeoData(data))
};

const displayGeoData = (data) => {
    console.log(data, 'data');
    requiredCity.value = "";

    city.innerHTML = `${data.name}, ${data.sys.country}`;
    temperature.innerHTML = `${mathRound(celciumTemprerature(data))} &#8451;`;

    const weatherIcon = document.createElement('img');
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const weatherDescr = document.createElement('span');
    weatherDescr.innerHTML = `${data.weather[0].main}`;

    const humidityIcon = document.createElement('i');
    humidityIcon.classList.add("fa", "fa-solid", "fa-water");

    const humidityDescr = document.createElement('p');
    humidityDescr.innerHTML = `Humidity: ${data.main.humidity}&#65285;`;
    humidityDescr.classList.add("info__wrap-descr");

    const pressureIcon = document.createElement('i');
    pressureIcon.classList.add("fa", "fa-brands", "fa-safari");

    const pressureDescr = document.createElement('p');
    pressureDescr.innerHTML = `Pressure: ${data.main.pressure}`;
    pressureDescr.classList.add("info__wrap-descr");

    const windSpeedIcon = document.createElement('i');
    windSpeedIcon.classList.add("fa", "fa-solid", "fa-wind");

    const windSpeedDescr = document.createElement('p');
    windSpeedDescr.innerHTML = `Wind Speed: ${data.wind.speed}mps`;
    windSpeedDescr.classList.add("info__wrap-descr");

    summary.appendChild(weatherIcon);
    summary.appendChild(weatherDescr);

    humidityDescr.appendChild(humidityIcon);
    humidity.appendChild(humidityDescr);

    pressureDescr.appendChild(pressureIcon);
    pressure.appendChild(pressureDescr);

    windSpeedDescr.appendChild(windSpeedIcon);
    windSpeed.appendChild(windSpeedDescr);

    loadingElem.style.display = "none";
};

const getLocation = () => {

    city.innerHTML = "";
    humidity.innerHTML = "";
    pressure.innerHTML = "";
    temperature.innerHTML = "";
    windSpeed.innerHTML = "";
    summary.innerHTML = "";

    loadingElem.style.display = "block";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${requiredCity.value}&appid=${weatherAPI}`)
        .then(response => response.json())
        .then(data => displayGeoData(data))
        .catch(err => {
            error.style.display = "block";
        })
};

const enterCityName = () => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.interimResults = true;

    recognition.addEventListener('result', (event) => {
        requiredCity.value = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
    })

    recognition.start();
}

closeError.addEventListener('click', function () {
    error.style.display = "none";
})

getWeatherButton.addEventListener('click', getCurrentLocation);

getRequiredWeather.addEventListener('click', getLocation);

microphone.addEventListener('click', enterCityName);