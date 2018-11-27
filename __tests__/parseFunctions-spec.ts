import { parseFunctions, FUNCTION_NAME } from '../src';
import {
  IsNull,
  Like,
  MoreThan,
  LessThan,
  Equal,
  Between,
  In,
  Any,
  Raw,
  Not,
} from 'typeorm';

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

test('Should parse LessThan() MoreThan() Equal()', async () => {
  const where = {
    a: '$LessThan(1)$',
    b: '$MoreThan(2)$',
    c: '$Equal("3")$',
  };
  parseFunctions(
    where,
    FUNCTION_NAME.LessThan,
    FUNCTION_NAME.MoreThan,
    FUNCTION_NAME.Equal
  );
  expect(where.a).toMatchObject(LessThan(1));
  expect(where.b).toMatchObject(MoreThan(2));
  expect(where.c).toMatchObject(Equal('3'));
});

test('Should parse Between() In() Any()', async () => {
  const where = {
    a: '$Between(1, 2)$',
    b: '$In([1, 2])$',
    c: '$Any([1, 2, 3])$',
  };
  parseFunctions(
    where,
    FUNCTION_NAME.Between,
    FUNCTION_NAME.In,
    FUNCTION_NAME.Any
  );
  expect(where.a).toMatchObject(Between(1, 2));
  expect(where.b).toMatchObject(In([1, 2]));
  expect(where.c).toMatchObject(Any([1, 2, 3]));
});

test('Should parse Raw()', async () => {
  const where: any = {
    a: '$Raw("xxx")$',
  };
  parseFunctions(where, FUNCTION_NAME.Raw);
  expect(where.a()).toMatchObject(Raw('xxx'));
});

test('Should parse Not()', async () => {
  const where = {
    a: '$Not("xxx")$',
    b: '$Not($IsNull()$)$',
  };
  parseFunctions(where, FUNCTION_NAME.Not, FUNCTION_NAME.IsNull);
  expect(where.a).toMatchObject(Not('xxx'));
  expect(where.b).toMatchObject(Not(IsNull()));
});
