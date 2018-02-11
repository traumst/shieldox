let axios = require('axios');

// 3rd Party API data
let { countriesAPI, weatherAPI } = require('./../config.json');

// Countries
async function getCountries(continent) {
	let requestUrl = `${countriesAPI.endpoint}/${continent}?fields=${countriesAPI.fields.join(';')}`;
	console.log(requestUrl);

	let response = await axios.get(requestUrl);
	return response.data.map(c => {
		return {
			country: c.name,
			capital: c.capital
		}
	});
}

// Weather
async function getWeather(city) {
	let requestUrl = `${weatherAPI.endpoint}?units=metric&appid=${weatherAPI.key}&q=${city}`;
	console.log(requestUrl);

	let response = await axios.get(requestUrl);
	let weather = response.data ? {
		capital: response.data.name,
		weather: {
			forecast: response.data.weather && response.data.weather[0] ?
			 response.data.weather[0].main : null,
			temperature: response.data.main ? response.data.main.temp : null
		}
	} : null;
	return weather;
}

// Filter
async function getAndFilter({ continent, filter }) {
	// Get counties on the continent
	let countries = await getCountries(continent);

	// TODO - prevent getting blocked by the API
	if (weatherAPI.maxCities) {
		countries = countries.slice(0, weatherAPI.maxCities);
	}

	// Get weather data for every capital
	let weatherPromises = countries.map(country => {
		if (country.capital) {
			// *.catch(...)* returns NULL when the promise is rejected
			return getWeather(country.capital).catch(() => null)
		}
		// Backup in case necessary data is missing
		return null;
	});
	// Wait for all promises to resolve/reject
	let weatherData = await Promise.all(weatherPromises);

	// Filter out nulls
	let weather = weatherData.filter(w => w)
	// Merging data from two arrays into one
	let countriesMergedWithWeather = countries.map(c => {
		let weatherTMP = weather.find(w => w.capital.toLowerCase() === c.capital.toLowerCase());
		return {
			country: c.country,
			capital: c.capital,
			weather: weatherTMP ? weatherTMP.weather : null
		}
	});

	// Apply filter by Forecast and Temperature
	return countriesMergedWithWeather.filter(x => x.weather
	   && x.weather.forecast.toLowerCase() === filter.weather.type.toLowerCase()
		 && x.weather.temperature >= filter.temp.min
		 && x.weather.temperature <= filter.temp.max);
}

module.exports = {
	getCountries,
	getWeather,
	getAndFilter
};