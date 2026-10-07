import { NoiseMeasurement } from './NoiseMeasurement.js';

// Централізовані бізнес-правила класифікації шуму
export const NOISE_LIMITS = Object.freeze({
  normalMax: 55,
  warningMax: 70
});

export class NoiseSensor {
  constructor(id, district, location, noiseLevel = 0) {
    this.id = id;
    this.district = district;
    this.location = location;
    this.noiseLevel = noiseLevel;
    this.measurements = [];

    if (noiseLevel > 0) {
      this.measurements.push(new NoiseMeasurement(noiseLevel));
    }
  }

  /**
   * Обчислює стан на основі централізованих меж
   */
  getStatus() {
    if (this.noiseLevel <= NOISE_LIMITS.normalMax) {
      return 'normal';
    } else if (this.noiseLevel <= NOISE_LIMITS.warningMax) {
      return 'warning';
    } else {
      return 'critical';
    }
  }

  /**
   * Додає нове вимірювання та оновлює поточний рівень
   */
  addMeasurement(measurement) {
    if (!(measurement instanceof NoiseMeasurement)) {
      throw new Error('Очікується обʼєкт класу NoiseMeasurement');
    }
    this.measurements.push(measurement);
    this.noiseLevel = measurement.value;
  }

  /**
   * Оновлює рівень шуму із перевіркою
   */
  updateNoiseLevel(value) {
    if (!NoiseSensor.isValidNoiseLevel(value)) {
      throw new Error(`Некоректне значення рівня шуму: ${value}`);
    }
    this.addMeasurement(new NoiseMeasurement(value));
  }

  /**
   * Static-метод перевірки допустимості рівня шуму
   */
  static isValidNoiseLevel(value) {
    return Number.isFinite(value) && value >= 0 && value <= 200;
  }

  /**
   * Static-метод фабрики об'єкта
   */
  static fromObject(data) {
    return new NoiseSensor(data.id, data.district, data.location, data.noiseLevel);
  }
}