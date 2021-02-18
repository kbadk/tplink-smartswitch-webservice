import TplinkApi from 'tplink-smarthome-api';

const smartSwitchClient = new TplinkApi.Client();

export async function getDeviceInfo(deviceIp) {
	const client = new TplinkApi.Client();
	const device = await client.getDevice({ host: deviceIp });
	return await device.getInfo();
}

export async function setPowerState(deviceIp, state) {
	const client = new TplinkApi.Client();
	const device = await client.getDevice({ host: deviceIp });
	return await device.setPowerState(state);
}
