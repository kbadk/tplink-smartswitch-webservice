import * as promClient from 'prom-client';

const metricGuages = {
	relay_state: new promClient.Gauge({
		name: 'relay_state',
		help: 'Relay state'
	}),
	on_time: new promClient.Gauge({
		name: 'on_time',
		help: 'On time, seconds'
	}),
	err_code: new promClient.Gauge({
		name: 'error_code',
		help: 'Error code'
	}),
	current: new promClient.Gauge({
		name: 'current_a',
		help: 'Current, amps'
	}),
	power: new promClient.Gauge({
		name: 'power_w',
		help: 'Power, watt'
	}),
	total_wh: new promClient.Gauge({
		name: 'total_wh',
		help: 'Total, watt hours'
	}),
	voltage: new promClient.Gauge({
		name: 'voltage_v',
		help: 'Voltage, volt'
	}),
}

export function getMetrics(realtimeData) {
	for (const metricName in metricGuages) {
		metricGuages[metricName].set(realtimeData[metricName]);
	}
	return promClient.register.metrics();
}
