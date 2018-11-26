import { parseFunctions, FUNCTION_NAME } from '../src';
import { IsNull, Like } from 'typeorm';

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

test('Should parse Like()', async () => {
  const b = {
    b1: 1,
    b2: 2,
    b3: 3,
  };
  const where = {
    a: 1,
    b,
    c: '$Like("123")$',
  };
  parseFunctions(where, FUNCTION_NAME.Like);
  expect(where.a).toBe(1);
  expect(where.b).toMatchObject(b);
  expect(where.c).toMatchObject(Like('123'));
});
