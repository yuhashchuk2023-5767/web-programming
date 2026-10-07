import { NoiseSensor } from './models/NoiseSensor.js';
import { MobileNoiseSensor } from './models/MobileNoiseSensor.js';
import { MonitoringSystem } from './services/MonitoringSystem.js';

// 1. Початкові дані
const initialData = [
  { id: 'NS-01', district: 'Галицький', location: 'просп. Свободи', noiseLevel: 58 },
  { id: 'NS-02', district: 'Франківський', location: 'вул. Наукова', noiseLevel: 74 },
  { id: 'NS-03', district: 'Шевченківський', location: 'просп. Чорновола', noiseLevel: 83 }
];

// 2. Ініціалізація системи моніторингу
const system = new MonitoringSystem();

initialData.forEach(data => {
  system.addSensor(NoiseSensor.fromObject(data));
});

// Додаємо мобільний датчик (наслідування)
const mobileSensor = new MobileNoiseSensor('NS-04-M', 'Сихівський', 'вул. Червоної Калини', 48, 15);
system.addSensor(mobileSensor);

// 3. Консольні експерименти з Prototype
console.group('Експерименти з Prototype та властивостями (Лаб 5)');
const sensorA = system.findSensorById('NS-01');
const sensorB = system.findSensorById('NS-02');

console.log('sensorA.getStatus === sensorB.getStatus:', sensorA.getStatus === sensorB.getStatus); // true
console.log('Object.hasOwn(sensorA, "noiseLevel"):', Object.hasOwn(sensorA, 'noiseLevel')); // true
console.log('Object.hasOwn(sensorA, "getStatus"):', Object.hasOwn(sensorA, 'getStatus')); // false
console.log('Середній рівень шуму системи:', system.getAverageNoiseLevel(), 'dB');
console.groupEnd();

// 4. Логіка відображення DOM
function renderSensorCard(sensor) {
  const status = sensor.getStatus();
  
  const card = document.createElement('div');
  card.className = `sensor-card ${status}`;
  
  card.innerHTML = `
    <div class="card-header">
      <span class="sensor-id">${sensor.id}</span>
      <span class="status-badge ${status}">${status.toUpperCase()}</span>
    </div>
    <div class="card-body">
      <p><strong>Район:</strong> ${sensor.district}</p>
      <p><strong>Адреса:</strong> ${sensor.location}</p>
      <p class="noise-value"><strong>Шум:</strong> <span id="val-${sensor.id}">${sensor.noiseLevel}</span> dB</p>
      ${sensor instanceof MobileNoiseSensor ? `<p class="battery">🔋 Батарея: ${sensor.batteryLevel}%</p>` : ''}
    </div>
    <div class="card-actions">
      <button onclick="window.updateSensor('${sensor.id}')">Симулювати замір</button>
    </div>
  `;
  
  return card;
}

function updateUI() {
  const container = document.getElementById('sensors-container');
  const avgElement = document.getElementById('avg-noise');
  
  if (container) {
    container.innerHTML = '';
    system.sensors.forEach(sensor => {
      container.appendChild(renderSensorCard(sensor));
    });
  }
  
  if (avgElement) {
    avgElement.textContent = `${system.getAverageNoiseLevel()} dB`;
  }
}

// Глобальна функція для кнопок
window.updateSensor = (id) => {
  const sensor = system.findSensorById(id);
  if (sensor) {
    const newNoise = Math.floor(Math.random() * (95 - 35 + 1)) + 35;
    sensor.updateNoiseLevel(newNoise);
    updateUI();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  updateUI();
});