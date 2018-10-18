import { IsNull, Not } from 'typeorm';
import { isObject } from 'util';

export enum FUNCTION_NAME {
  IsNull,
  // Not,
}

/**
 *
 * @param where 前端传进的where对象
 * @param functionNames 需要生成的方法列表
 */
export function parseFunctions(
  where: any,
  ...functionNames: FUNCTION_NAME[]
): any {
  for (const k of Object.keys(where)) {
    if (isObject(where[k])) {
      where[k] = parseFunctions(where[k], ...functionNames);
    } else {
      where[k] = parse(where, k, functionNames);
    }
  }
  return where;
}

function parse(obj: any, k: string, functionNames: FUNCTION_NAME[]) {
  for (const fn of functionNames) {
    switch (fn) {
      case FUNCTION_NAME.IsNull:
        obj[k] = parseIsNull(obj, k);
        break;
      // case FUNCTION_NAME.Not:
      //   obj[k] = parseNot(obj, k, functionNames);
      //   break;
    }
  }
  return obj[k];
}

function parseIsNull(obj: any, k: string) {
  if (obj[k] === '$IsNull()$') return IsNull();
  return obj[k];
}

// function parseNot(obj: any, k: string, functionNames: FUNCTION_NAME[]) {
//   const match = /\$Not\((.*)\)\$/.exec(obj[k]);
//   if (!match) return obj[k];
//   return Not(parse(obj, k, functionNames));
// }
