/**
 * Лабораторна робота №4: Робота з циклами, функціями та функціональними виразами в JS
 * Дисципліна: WEB-програмування
 * Проєкт: «Акустична варта»
 * Студентка: Гащук Юлія Володимирівна (КН-41)
 */

// ==========================================
// 1. ВИХІДНІ ДАНІ ТА НАЛАШТУВАННЯ
// ==========================================
const noiseLevels = [
  42, 55, 61, 78, 83, 67, 49, 72, 91, 58, 64, 76,
  53, 47, 88, 69, 74, 82, 95, 51, 71, -1, 85, 63,
  79, 39, 141, 86
];

const warningLevel = 70;
const criticalLevel = 85;
const minValidLevel = 30;
const maxValidLevel = 130;

// ==========================================
// 2. СТРІЛКОВІ ФУНКЦІЇ (Arrow Functions)
// ==========================================

// Перевірка коректності вимірювання
const isValidLevel = (level, min = minValidLevel, max = maxValidLevel) =>
  Number.isFinite(level) && level >= min && level <= max;

// Оформлення підпису рівня шуму (один параметр, implicit return)
const formatDb = value => (value !== null ? `${value} dB` : 'Н/Д');

// Перевірка перевищення порога
const isAbove = (value, threshold) => value > threshold;

// ==========================================
// 3. FUNCTION DECLARATION (Оголошення функцій)
//    Демонструє Hoisting (доступна до її опису в коді)
// ==========================================

/**
 * Шукає перше критичне вимірювання за допомогою циклу for
 */
function findFirstCritical(data, threshold) {
  for (let i = 0; i < data.length; i++) {
    const val = data[i];
    if (!isValidLevel(val)) continue; // Пропускаємо некоректні дані

    if (val > threshold) {
      return {
        value: val,
        position: i + 1 // Позиція для людини (індекс + 1)
      };
    }
  }
  return null;
}

/**
 * Шукає серію з 3 безпечних вимірювань поспіль після першого критичного (цикл while)
 */
function findRecovery(data, firstCriticalPos, safeThreshold) {
  if (!firstCriticalPos) return null;

  let index = firstCriticalPos;
  let consecutiveSafeCount = 0;

  while (index < data.length) {
    const val = data[index];

    if (isValidLevel(val) && val <= safeThreshold) {
      consecutiveSafeCount++;
      if (consecutiveSafeCount === 3) {
        return {
          position: index + 1,
          value: val
        };
      }
    } else if (isValidLevel(val) && val > safeThreshold) {
      consecutiveSafeCount = 0; // Скидаємо лічильник
    }
    index++;
  }

  return null;
}

/**
 * Пошук першого коректного вимірювання за допомогою циклу do...while
 */
function getFirstValidElement(data) {
  if (!data || data.length === 0) return null;

  let i = 0;
  let firstValid = null;

  do {
    if (isValidLevel(data[i])) {
      firstValid = { value: data[i], position: i + 1 };
      break;
    }
    i++;
  } while (i < data.length);

  return firstValid;
}

// ==========================================
// 4. FUNCTION EXPRESSION (Функціональні вирази)
//    Демонструє TDZ (викликається лише ПІСЛЯ оголошення)
// ==========================================

/**
 * Аналізує масив вимірювань за допомогою циклу for...of
 */
const analyzeData = function (data) {
  let validCount = 0;
  let sum = 0;
  let min = null;
  let max = null;

  const categories = {
    normal: 0,   // <= 70 dB
    warning: 0,  // 70 < x <= 85 dB
    critical: 0  // > 85 dB
  };

  const invalidRecords = [];

  let index = 0;
  for (const level of data) {
    index++;
    if (!isValidLevel(level)) {
      invalidRecords.push({ position: index, value: level });
      continue;
    }

    validCount++;
    sum += level;

    if (min === null || level < min) min = level;
    if (max === null || level > max) max = level;

    if (level <= warningLevel) {
      categories.normal++;
    } else if (level <= criticalLevel) {
      categories.warning++;
    } else {
      categories.critical++;
    }
  }

  const average = validCount > 0 ? sum / validCount : null;

  return {
    total: data.length,
    validCount,
    invalidRecords,
    average,
    min,
    max,
    categories
  };
};

/**
 * Синхронна передача функції як аргументу (callback)
 */
const processMonitoring = function (dataArray, analyzerCallback) {
  return analyzerCallback(dataArray);
};

// ==========================================
// 5. ФОРМУВАННЯ КОНСОЛЬНОГО ЗВІТУ
// ==========================================

function generateConsoleReport() {
  const stats = processMonitoring(noiseLevels, analyzeData);
  const firstCritical = findFirstCritical(noiseLevels, criticalLevel);
  const recovery = findRecovery(
    noiseLevels,
    firstCritical ? firstCritical.position : null,
    warningLevel
  );

  console.group('Акустична варта — звіт моніторингу');

  console.log(`Пороги: попередження > ${warningLevel} dB; критичний рівень > ${criticalLevel} dB`);
  console.log(`Усього вимірювань: ${stats.total}`);
  console.log(`Коректних: ${stats.validCount}`);
  console.log(`Некоректних: ${stats.invalidRecords.length}`);

  // Підсумкова таблиця категорій
  console.table([
    { 'Категорія': 'Без перевищення', 'Кількість': stats.categories.normal },
    { 'Категорія': 'Попередження', 'Кількість': stats.categories.warning },
    { 'Категорія': 'Критичні', 'Кількість': stats.categories.critical }
  ]);

  const avgFormatted = stats.average !== null ? stats.average.toFixed(2).replace('.', ',') : 'Н/Д';
  console.log(`Середній рівень: ${avgFormatted} dB`);
  console.log(`Мінімальний рівень: ${formatDb(stats.min)}`);
  console.log(`Максимальний рівень: ${formatDb(stats.max)}`);

  if (firstCritical) {
    console.log(`Перше критичне вимірювання: ${firstCritical.value} dB, позиція ${firstCritical.position}`);
  } else {
    console.log('Перше критичне вимірювання: відсутнє');
  }

  if (recovery) {
    console.log(`Відновлення — три безпечні вимірювання поспіль: позиція ${recovery.position} (${recovery.value} dB)`);
  } else {
    console.log('Відновлення — три безпечні вимірювання поспіль: не знайдено');
  }

  const totalWarnings = stats.categories.warning + stats.categories.critical;
  if (totalWarnings > 0) {
    console.warn(`Поріг ${warningLevel} dB перевищено у ${totalWarnings} вимірюваннях.`);
  }

  if (stats.invalidRecords.length > 0) {
    const invalidStr = stats.invalidRecords
      .map(r => `позиція ${r.position} (${r.value} dB)`)
      .join(', ');
    console.error(`Некоректні дані: ${invalidStr}.`);
  }

  const recStatus = recovery ? 'виявлено' : 'не виявлено';
  console.log(
    `Висновок: зафіксовано ${stats.categories.critical} критичні вимірювання; ` +
    `після першого з них стійкого відновлення ${recStatus}.`
  );

  console.groupEnd();
}

// Автоматичний запуск звіту
generateConsoleReport();