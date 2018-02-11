let apiRouter = require("express").Router();

let { getCountries, getWeather, getAndFilter } = require('./functionality');

// Ping
apiRouter.get('/', (req, res) => {
	res.send('ping');
});

// Countries
apiRouter.get('/countries/:continent*?', async (req, res) => {
	let { params: { continent = 'americas' } } = req;
	try {
		res.json(await getCountries(continent));
	} catch(err) {
		console.error(err.message);
		res.sendStatus(404);
	}
});

// Weather
apiRouter.get('/weather/:capital', async (req, res) => {
	let { params: { capital } } = req;
	try {
		res.json(await getWeather(capital));
	} catch(err) {
		console.error(err.message);
		res.sendStatus(404);
	}
});

// Filter
apiRouter.post('/filter', async (req, res) => {
	let { body: { type, filter } } = req;
	try {
		res.json(await getAndFilter({ continent: type, filter }));
	} catch(err) {
		console.error(err.message);
		res.sendStatus(404);
	}
});

module.exports = apiRouter;