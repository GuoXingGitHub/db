import { parseFunctions, FUNCTION_NAME } from '../src';
import { IsNull } from 'typeorm';

test('Should parse IsNull()', async () => {
  const b = {
    b1: 1,
    b2: 2,
    b3: 3,
  };
  const where = {
    a: 1,
    b,
    c: '$IsNull()$',
  };
  parseFunctions(where, FUNCTION_NAME.IsNull);
  expect(where.a).toBe(1);
  expect(where.b).toMatchObject(b);
  expect(where.c).toMatchObject(IsNull());
});
