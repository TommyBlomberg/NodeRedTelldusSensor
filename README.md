# node-red-contrib-telldus-sensor
## Description

Node that reads values of a sensor in Telldus Live.

## Installation
This package is not yet published to npm so it must be copied to a folder (clone or download).
```
$ cd ~/.node-red
$ npm install <path to folder>
```
## Usage

*Configuration:*
- Name : Specify a name for the node
- Id : The <code>id</code> of the sensor, <strong>NOT</strong> the <code>sensorId</code>
- Public key : Your public key from Telldus
- Private key : Your private key from Telldus
- Token : Your token from Telldus
- Token secret : Your token secret from Telldus

All credentials must be generated at <a href="https://api.telldus.com/">Telldus API</a>

*Messages received:*

This depends on sensor type, but typically from a temperature sensor it is:
- <code>msg.payload.temperature</code> : Sensor temperature
- <code>msg.payload.humidity</code> : Sensor humidity

Inspect <code>msg.payload</code> to see the available types for a specific sensor

## Release notes

#### v0.1.0

- First version
- Sensor value type <code>temp</code> is renamed to <code>temperature</code> for consistency
- Basic error handling



