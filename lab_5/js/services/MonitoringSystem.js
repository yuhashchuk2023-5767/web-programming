import { NoiseSensor } from '../models/NoiseSensor.js';

export class MonitoringSystem {
  constructor() {
    this.sensors = [];
  }

  addSensor(sensor) {
    if (!(sensor instanceof NoiseSensor)) {
      throw new Error("Можна додавати лише екземпляри NoiseSensor");
    }
    if (this.sensors.some(item => item.id === sensor.id)) {
      throw new Error(`Датчик з ID ${sensor.id} вже існує в системі`);
    }
    this.sensors.push(sensor);
  }

  findSensorById(id) {
    return this.sensors.find(sensor => sensor.id === id) || null;
  }

  getSensorsByDistrict(district) {
    return this.sensors.filter(sensor => sensor.district === district);
  }

  getCriticalSensors() {
    return this.sensors.filter(sensor => sensor.getStatus() === 'critical');
  }

  getAverageNoiseLevel() {
    if (this.sensors.length === 0) return 0;
    const total = this.sensors.reduce((sum, sensor) => sum + sensor.noiseLevel, 0);
    return Number((total / this.sensors.length).toFixed(2));
  }
}