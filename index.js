// ширина и высота
const W = 10,
  H = 10;
// минимальное и максимальное значение элемента
const MIN = -100,
  MAX = 100;

// случайное число от min до max включительно
function randInt(min = MIN, max = MAX) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

// класс "строка чисел"
class NumberLine extends Array {
  // минимум среди всех строк в программе
  static minimum = +Infinity;

  // конструктор
  constructor(...args) {
    super(...args);

    // сразу обновить минимум
    this.updateMinimum(...args);

    // содержит ли строка минимум
    // если минимум есть в нескольких строках, каждая вернет "*"
    Object.defineProperty(this, "содержит минимум", {
      get() {
        return this.includes(NumberLine.minimum) ? "*" : "";
      },
      enumerable: true,
    });

    // минимальный положительный элемент
    Object.defineProperty(this, "наименьшее > 0", {
      get() {
        try {
          // фильтруем положительные элементы и ищем среди них минимум
          return this.filter((x) => x > 0).reduce((a, b) => Math.min(a, b));
        } catch (e) {
          // reduce вернет ошибку и catch выполнится, если в строке нет положительных элементов
          return undefined;
        }
      },
      enumerable: true,
    });

    // сколько чисел нужно заменить, чтобы в строке было не более двух элементов одного знака подряд
    Object.defineProperty(this, "нужно замен", {
      get() {
        const N = 3;
        let modifications = 0;
        // k - количество элементов одного знака подряд
        // sign - знак последнего проверенного числа
        for (let i = 1, k = 2, sign = Math.sign(this[0]); i < W; i++, k++) {
          // знак текущего числа
          const currentSign = Math.sign(this[i]);
          // если знак текущего числа равен 0 или не равен знаку предыдущего
          if (!currentSign || currentSign !== sign) {
            // сбрасываем счетчик
            k = 1;
            // устанавливаем новый знак
            sign = currentSign;
            // переходим к следующему числу
            continue;
          }
          // если k делится на 3
          if (!(k % N)) {
            // значит нужна замена числа
            modifications++;
          }
        }
        return modifications;
      },
      enumerable: true,
    });
  }
  // обновить минимум, если требуется
  updateMinimum(...args) {
    for (let item of args) {
      NumberLine.minimum = Math.min(item, NumberLine.minimum);
    }
  }
  // метод push сразу считает минимум
  push(...args) {
    this.updateMinimum(...args);
    return super.push(...args);
  }
  // инициализация случайными числами
  create() {
    for (let i = 0; i < W; i++) {
      const item = randInt();
      this.push(item);
    }
    return this;
  }
}

// создание двумерного массива
const matrix = [];
for (let i = 0; i < H; i++) {
  matrix.push(new NumberLine().create());
}

// test cases

// нужно замен
// matrix.push(new NumberLine(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
// matrix.push(new NumberLine(1, 2, 3, -4, -5, -6, 7, 8, 9, -10));
// matrix.push(new NumberLine(-1, 2, 3, 4, 5, 6, -7, -8, 9, -10));
// matrix.push(new NumberLine(-1, 2, 3, 4, 5, 6, 7, -8, 9, -10));

// минимум есть в 2 и более строках
// matrix.push(new NumberLine(MIN, 2, 3, 4, 5, 6, -7, -8, 9, -10));
// matrix.push(new NumberLine(MIN, 2, 3, 4, 5, 6, -7, -8, 9, -10));

// 0 не влияет на наименьшее > 0 и количество замен
// matrix.push(new NumberLine(0, -2, -3, 0, 0, 0, 0, 8, 9, 10));

// нет положительных элементов
// matrix.push(new NumberLine(0, -2, -3, 0, 0, 0, 0, -8, -9, -10));

// вывод в виде таблицы
console.table(matrix);
