import { env } from 'process';

import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { getDeviceInfo, setPowerState } from './device-helper.js';
import { getMetrics } from './metrics-helper.js';

const PORT = env.PORT || 8080;

function sleep(seconds) {
	return new Promise((accept) => setTimeout(accept, 1000 * seconds));
}

async function main() {
	const app = express();

	app.get('/:deviceIp([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\)/', async (req, res) => {
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		try {
			const deviceInfo = await getDeviceInfo(req.params.deviceIp);
			console.log(`Responding with data for ${req.params.deviceIp} to ${ip}`);
			res.json(deviceInfo);
		} catch (e) {
			console.error('Error:', String(e));
			res.sendStatus(StatusCodes.GATEWAY_TIMEOUT);
		}
	});

	app.post('/:deviceIp([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\)/:state(on|off)', async (req, res) => {
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		try {
			console.log(`Turning device at ${req.params.deviceIp} ${deviceOn ? 'on' : 'off'}`);
			const deviceOn = await setPowerState(req.params.deviceIp, req.params.state === 'on');
			res.json({ deviceStatus: req.params.state === 'on' ? 'on' : 'off' });
		} catch (e) {
			console.error('Error:', String(e));
			res.sendStatus(StatusCodes.GATEWAY_TIMEOUT);
		}
	});

	app.post('/:deviceIp([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\)/restart', async (req, res) => {
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		const seconds = Number(req.query.seconds) || 10;
		try {
			console.log(`Restarting device at ${req.params.deviceIp} (${seconds} delay)`);
			await setPowerState(req.params.deviceIp, false);
			await sleep(seconds);
			await setPowerState(req.params.deviceIp, true);
			res.json({ deviceStatus: 'on' });
		} catch (e) {
			console.error('Error:', String(e));
			res.sendStatus(StatusCodes.GATEWAY_TIMEOUT);
		}
	});

	app.get('/:deviceIp([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\)/metrics', async (req, res) => {
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		try {
			const deviceInfo = await getDeviceInfo(req.params.deviceIp);
			console.log(`Responding with data for ${req.params.deviceIp} to ${ip} (metrics)`);
			const switchData = { ...deviceInfo.emeter.realtime, ...deviceInfo.sysInfo };
			res.type('text/plain').send(await getMetrics(switchData));
		} catch (e) {
			console.error('Error:', String(e));
			res.sendStatus(StatusCodes.GATEWAY_TIMEOUT);
		}
	});

	app.get('/health', (req, res) => {
		res.sendStatus(StatusCodes.OK);
	})

	app.all('*', (req, res) => {
		res.sendStatus(StatusCodes.NOT_IMPLEMENTED);
	});

	app.listen(PORT, () => console.log('Listening on', PORT));
}

main();
