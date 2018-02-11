let chai      = require('chai');
chai.use(require('chai-json-schema'));
let expect    = chai.expect;
let axios     = require('axios');

describe('Shieldox WebApi', () => {

	let baseUrl = 'http://localhost:3000/api/v1';

	it('is available', async () => {
		let response = await axios.get(baseUrl);
		expect(response.status).to.equal(200);
	});

	describe('Requests a list of countries on a continent', () => {

		let countriesResponse = require('./examples/countries.json');

		it('responds with code 200', async () => {
			let response = await axios.get(`${baseUrl}/countries`);
			expect(response.status).to.equal(200);
		});

		it('returns a valid json', async () => {
			let response = await axios.get(`${baseUrl}/countries`);
			response.data.every(c => expect(c).to.contains.all.keys(Object.keys(countriesResponse)));
		});
	});

	describe('Requests weather info', () => {

		let weatherInfo = require('./examples/weather.json');

		it('responds with code 200', async () => {
			let response = await axios.get(`${baseUrl}/weather/London`);
			expect(response.status).to.equal(200);
		});

		it('returns a valid json', async () => {
			let response = await axios.get(`${baseUrl}/weather/London`);
			expect(response.data).to.contains.all.keys(Object.keys(weatherInfo));
		});
	});

	describe('Filters weather data', () => {

		let filteredData = require('./examples/filter.json');
		let filterPayload = {
			"type": "Asia",
			"filter": {
				"temp": {
					"min": 30,
					"max": 35
				},
				"weather": {
					"type": "clear"
				}
			}
		};

		it('responds with code 200', async () => {
			let response = await axios.post(`${baseUrl}/filter`, filterPayload);
			expect(response.status).to.equal(200);
		});

		it('returns a valid json', async () => {
			let response = await axios.post(`${baseUrl}/filter`, filterPayload);
			// expect(response.data).to.contains.all.keys(Object.keys(filteredData));
			response.data.every(x => expect(x).to.contains.all.keys(Object.keys(filteredData)));
		});
	});

});