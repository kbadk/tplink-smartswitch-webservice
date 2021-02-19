# TPLink Smart Switch

Node.js microservice for turning TPLink Smart Switch on and off and reading switch data.

Presents a JSON object response (`/<deviceIp>/`), Prometheus metrics
(`/<deviceIp>/metrics`), and an API to turn a switch on/off (`/<deviceIp>/<on|off>`) and
restart the switch (`/<deviceIp>/restart[?seconds=<delay>]`).
## Usage

```
$ curl -s localhost:8080/192.168.0.101 | jq
{
  "sysInfo": {
    "sw_ver": "1.0.5 Build 200917 Rel.095551",
    "hw_ver": "4.0",
    "model": "HS110(EU)",
    ...
    "relay_state": 1,
    "on_time": 1479,
    ...
  },
  "cloud": {
    ...
  },
  "emeter": {
    "realtime": {
      "voltage_mv": 235146,
      "current_ma": 177,
      "power_mw": 19486,
      "total_wh": 88,
      "err_code": 0,
      "current": 0.177,
      "power": 19.486,
      "total": 0.088,
      "voltage": 235.146
    }
  },
  "schedule": {
    ...
  }
}
```

```
$ curl -s -X POST localhost:8080/192.168.0.101/on | jq
{
  "deviceStatus": "on"
}
```

```
$ curl -s -X POST localhost:8080/192.168.0.101/off | jq
{
  "deviceStatus": "off"
}
```

```
$ curl -s -X POST localhost:8080/192.168.0.101/restart?seconds=10 | jq
{
  "deviceStatus": "on"
}
```

```sh
$ curl -s localhost:8080/192.168.0.101/metrics
# HELP relay_state Relay state
# TYPE relay_state gauge
relay_state 1

# HELP on_time On time, seconds
# TYPE on_time gauge
on_time 1481

# HELP error_code Error code
# TYPE error_code gauge
error_code 0

# HELP current_a Current, amps
# TYPE current_a gauge
current_a 0.177

# HELP power_w Power, watt
# TYPE power_w gauge
power_w 19.483

# HELP total_wh Total, watt hours
# TYPE total_wh gauge
total_wh 88

# HELP voltage_v Voltage, volt
# TYPE voltage_v gauge
voltage_v 235.14
```

Sample `docker-compose.yml`

```yaml
version: "3"

services:
  smartswitch:
    build: .
    container_name: smartswitch
    hostname: smartswitch
    ports:
      - 8080:8080
    environment:
      - TZ=Europe/Copenhagen
    restart: on-failure
```

## Purpose

Unlimited potential!

I use it in conjunction with [Node-RED](https://nodered.org/) to toggle devices on and
off under certain conditions.

I also use it for plotting power consumption in Grafana from the metrics endpoint.
