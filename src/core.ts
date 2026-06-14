import {
  bgBlackPen,
  bgBrightYellowPen,
  bgCyanPen,
  colorText,
} from '@mudbean/pen';
import { esc } from '@mudbean/pen-static';
import { createConstructor, getRandomString } from '@mudbean/utils';
import { DevLog, DevLogType, DogOptions } from './type';
import { getEnv, parseOption, platform, setType } from './util';

/**
 *
 * @param options 配置项
 * @returns 函数对象
 *
 */
const DogConstructor = createConstructor(Dog);

export { DogConstructor as Dog };

/**
 * ## 创建 dev log 工厂函数
 * @param options - 配置项
 * @returns - dev log 工厂函数
 */
function Dog(this: DevLog, options?: DogOptions): DevLog {
  const _p = parseOption(options);
  this.name = _p.name || getRandomString(12);
  this.fold = Boolean(_p.fold);
  const env = getEnv(this.name);
  let type = _p.type || false;
  this.mark = '';
  /**  默认 node 环境以获取到的环境值为准，而非 node 环境默认开启，并通过自定义的 @qqi/babel-plugin-remove-dog-calls 来进行过滤正式环境（环境值需要自定义） */
  this.type = platform === 'node' ? setType(env ?? type) : true;

  /**
   * ## 解析 error
   * @param type
   */
  const prefix = (type: DevLogType) => {
    try {
      throw new Error();
    } catch (error) {
      const parseErrorResult = ((error as Error).stack?.split('\n') || []).map(
        item => {
          const reg = /at\s(.*)\s\((.*):(\d*):(\d*)\)/;
          const res = reg.exec(item);
          if (res) {
            return {
              name: res[1],
              path: res[2],
              line: res[3],
              column: res[4],
            };
          }
          return {
            name: '',
          };
        },
      );

      const result = parseErrorResult.filter(
        e => e.name !== '' && e.path !== undefined,
      );

      const res = result[3] ?? result[2] ?? result[1] ?? result[0];

      const startStr = ` ${type === 'info' ? '💡' : type === 'error' ? '❌' : '⚠️ '} ${new Date().toLocaleString()} `;

      const printStartPenStr = (
        type === 'info'
          ? bgCyanPen.brightWhite
          : type === 'error'
            ? bgBlackPen.red
            : bgBrightYellowPen.brightGreen
      )(startStr);

      const mark = res?.name ?? '';

      if (this.fold && mark) {
        if (mark === this.mark) {
          // 不处理
        } else {
          if (this.mark) {
            console.groupEnd();
          }
          console.groupCollapsed(mark);
        }
      }

      this.mark = mark;
      const msg = `${printStartPenStr} ${mark}  ${res?.line?.concat(' 行')} ${res?.column?.concat(' 列')}`;

      return colorText(msg);
    }
  };

  this.info = (...arg) => {
    if (this.type === 'all' || this.type === 'info' || this.type === true) {
      const _prefix = prefix('info');
      console.log(..._prefix);
      console.log(...arg);
      // console.log.apply(console, arg);
    }
  };

  /**
   * @param msg
   */
  this.warn = (...msg: unknown[]) => {
    if (this.type === 'all' || this.type === 'warn' || this.type === true) {
      const _prefix = prefix('warn');
      console.log(..._prefix);
      console.warn.apply(console, msg);
    }
  };

  /**
   *
   * @param msg
   */
  this.error = (...msg: unknown[]) => {
    if (this.type === 'all' || this.type === 'error' || this.type === true) {
      const _prefix = prefix('error');
      console.log(..._prefix);
      console.error.apply(console, msg);
    }
  };

  /**
   *  本体方法
   * @param str
   */
  const dog = (...str: unknown[]) => {
    this.info(...str);
  };

  // 设置 prototype
  Object.setPrototypeOf(dog, this);
  const _this = this;
  return new Proxy(dog, {
    get(target, p, receiver) {
      if (p === 'apply') {
        return target;
      } else {
        return Reflect.get(target, p, receiver);
      }
    },
    set(_target, p, newValue) {
      Reflect.set(_this, p, newValue); // 将要设置的值映射到 this 上而不是自身
      return true;
    },
  }) as unknown as DevLog;
}
/** 原型上添加 clear 方法 */
Dog.prototype.clear = () => {
  if (platform === 'browser') {
    console.clear();
  } else {
    console.log(esc.concat('c'));
  }
};
