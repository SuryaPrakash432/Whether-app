const apiKey = 'dde9d858c3d5928f95309da2f35b3c91'; // Replace with your OpenWeatherMap API Key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?';

window.addEventListener('load', () => {
    document.body.classList.add('default-bg');  // Set default background
    getWeatherByLocation();  // Try to get weather based on user's location on page load
});

// Get weather for city when user submits form
document.getElementById('getWeather').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent page reload

    const city = document.getElementById('city').value;

    if (city) {
        // Fetch weather by city name
        fetchWeatherByCity(city);
    } else {
        alert('Please enter a city name');
    }
});

// Function to get weather by user's location (geolocation)
async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(`${apiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                // Display weather data based on location
                displayWeather(data);
            } catch (error) {
                console.error('Error fetching location-based weather:', error);
            }
        }, function(error) {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location. Please try again.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Function to get weather by city name
async function fetchWeatherByCity(city) {
    try {
        const response = await fetch(`${apiUrl}q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        // Display weather data based on city
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather by city:', error);
        alert('Error: ' + error.message);
    }
}

// Function to display the weather information
function displayWeather(data) {
    const weatherDetails = document.getElementById('weatherDetails');
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    // Set background theme based on weather conditions
    document.body.className = '';  // Reset background class
    const mainWeather = data.weather[0].main.toLowerCase();
    
    if (mainWeather.includes('clear')) document.body.classList.add('sunny');
    else if (mainWeather.includes('clouds')) document.body.classList.add('cloudy');
    else if (mainWeather.includes('rain')) document.body.classList.add('rainy');
    else if (mainWeather.includes('haze')) document.body.classList.add('haze');
    else if (mainWeather.includes('mist')) document.body.classList.add('mist');
    else if (mainWeather.includes('snow')) document.body.classList.add('snow');
    else if (mainWeather.includes('thunderstorm')) document.body.classList.add('thunderstorm');
    else if (mainWeather.includes('drizzle')) document.body.classList.add('drizzle');
    else if (mainWeather.includes('smoke')) document.body.classList.add('smoke');
    else document.body.classList.add('default-bg');  // Default background for other cases

    // Format sunrise and sunset times
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    // Display weather details with icon and information
    weatherDetails.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon" />
        <p>${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Feels Like: ${data.main.feels_like}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
        <p><i class="fas fa-sun"></i> Sunrise: ${sunrise}</p>
        <p><i class="fas fa-moon"></i> Sunset: ${sunset}</p>
    `;
}
