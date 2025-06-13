import Big from 'big.js';

export class Calculator {
  private value: Big;

  constructor(initialValue: string | number) {
    this.value = new Big(initialValue);
  }

  private getNumber(num: string | number | Calculator) {
    return num instanceof Calculator ? num.value : num;
  }

  /**
  * 加法
  */
  add(num: string | number | Calculator): Calculator {
    this.value = this.value.plus(this.getNumber(num));
    return this;
  }

  /**
  * 减法
  */
  subtract(num: string | number | Calculator): Calculator {
    this.value = this.value.minus(this.getNumber(num));
    return this;
  }

  /**
  * 乘法
  */
  multiply(num: string | number | Calculator): Calculator {
    this.value = this.value.times(this.getNumber(num));
    return this;
  }

  /**
  * 除法
  */
  divide(num: string | number | Calculator): Calculator {
    if (num === '0') {
      throw new Error('Division by zero is not allowed.');
    }

    this.value = this.value.div(this.getNumber(num));
    return this;
  }

  /**
  * 四舍五入 直接返回值，不是对象
  */
  toFixed(num: string | number): number {
    const val = this.value.toFixed(Number(num));
    return Number(val);
  }

  getResult(): string {
    return this.value.toString();
  }

  /**
   *
   */
  toNumber() {
    return this.value.toNumber();
  }
}
