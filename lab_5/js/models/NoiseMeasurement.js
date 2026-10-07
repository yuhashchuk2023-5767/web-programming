/**
 * Клас, що представляє одне вимірювання шуму
 */
export class NoiseMeasurement {
  constructor(value, measuredAt = new Date()) {
    if (!Number.isFinite(value)) {
      throw new Error('Значення вимірювання має бути скінченним числом');
    }
    this.value = value;
    this.measuredAt = measuredAt;
  }

  toString() {
    const timeStr = this.measuredAt.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${this.value} dB (${timeStr})`;
  }
}