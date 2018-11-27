import {
  IsNull,
  Like,
  LessThan,
  MoreThan,
  Equal,
  Between,
  In,
  Any,
  Raw,
  Not,
} from 'typeorm';
import { isObject } from 'util';

export enum FUNCTION_NAME {
  IsNull,
  Like,
  LessThan,
  MoreThan,
  Equal,
  Between,
  In,
  Any,
  Raw,
  Not,
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
      case FUNCTION_NAME.LessThan:
        obj[k] = parseLessThan(obj, k);
        break;
      case FUNCTION_NAME.MoreThan:
        obj[k] = parseMoreThan(obj, k);
        break;
      case FUNCTION_NAME.Equal:
        obj[k] = parseEqual(obj, k);
        break;
      case FUNCTION_NAME.Like:
        obj[k] = parseLike(obj, k);
        break;
      case FUNCTION_NAME.Between:
        obj[k] = parseBetween(obj, k);
        break;
      case FUNCTION_NAME.In:
        obj[k] = parseIn(obj, k);
        break;
      case FUNCTION_NAME.Any:
        obj[k] = parseAny(obj, k);
        break;
      case FUNCTION_NAME.Raw:
        obj[k] = parseRaw(obj, k);
        break;
      case FUNCTION_NAME.Not:
        obj[k] = parseNot(obj, k, functionNames);
        break;
    }
  }
  return obj[k];
}

function parseIsNull(obj: any, k: string) {
  if (obj[k] === '$IsNull()$') return IsNull();
  return obj[k];
}

function parseLessThan(obj: any, k: string) {
  const match = /^\$LessThan\((.*?)\)\$$/.exec(obj[k]);
  if (!match) return obj[k];
  return LessThan(parseFloat(match[1]));
}

function parseMoreThan(obj: any, k: string) {
  const match = /^\$MoreThan\((.*?)\)\$$/.exec(obj[k]);
  if (!match) return obj[k];
  return MoreThan(parseFloat(match[1]));
}

function parseEqual(obj: any, k: string) {
  const match = /^\$Equal\(["'](.*?)["']\)\$$/.exec(obj[k]);
  if (!match) return obj[k];
  return Equal(match[1]);
}

function parseLike(obj: any, k: string) {
  const match = /^\$Like\(["'](.*?)["']\)\$$/.exec(obj[k]);
  if (!match) return obj[k];
  return Like(match[1]);
}

function parseBetween(obj: any, k: string) {
  const match = /^\$Between\((\d*?),\s*(\d*?)\)\$$/.exec(obj[k]);
  if (!match) return obj[k];
  return Between(parseFloat(match[1]), parseFloat(match[2]));
}

function parseIn(obj: any, k: string) {
  const match = /^\$In\((.*?)\)\$$/.exec(obj[k]);
  if (!match) return obj[k];
  try {
    const m = JSON.parse(match[1]);
    return In(m);
  } catch (e) {
    return obj[k];
  }
}

function parseAny(obj: any, k: string) {
  const match = /^\$Any\((.*?)\)\$$/.exec(obj[k]);
  if (!match) return obj[k];
  try {
    const m = JSON.parse(match[1]);
    return Any(m);
  } catch (e) {
    return obj[k];
  }
}

function parseRaw(obj: any, k: string) {
  const match = /^\$Raw\(["'](.*?)["']\)\$$/.exec(obj[k]);
  if (!match) return obj[k];
  return _ => Raw(match[1]);
}

function parseNot(obj: any, k: string, functionNames: FUNCTION_NAME[]) {
  const match = /^\$Not\(["']?(.*?)["']?\)\$$/.exec(obj[k]);
  if (!match) return obj[k];
  return Not(parse({ a: match[1] }, 'a', functionNames));
}
