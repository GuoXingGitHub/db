import { list } from '../src/list';
import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const LIST_OPTIONS_KEY = 'x-corelink-list-options';
const PAGINATE_KEY = 'x-corelink-paginate';

@Entity()
class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  gender: number;

  @Column()
  age: number;

}

// Records in database
// [
//   {"age": 30, "gender": 1, "id": 1, "username": "kuyoonjo"}, 
//   {"age": 20, "gender": 1, "id": 2, "username": "tom"}, 
//   {"age": 8, "gender": 0, "id": 3, "username": "kitty"},
// ]

let connection: Connection;

beforeAll(async () => {
  const options: SqliteConnectionOptions = {
    type: 'sqlite',
    database: '__tests__/db',
    entities: [User],
    logging: false,
  };

  try {
    connection = await createConnection(options);
    console.log('Database connected.');
  } catch (e) {
    console.error(e);
  }
});

test('Should list all users', async () => {
  const up = connection.getRepository(User);
  const res = await list(up);
  expect(res.total).toBe(3);
  expect(res.page).toBe(1);
  expect(res.pages).toBe(1);
  expect(res.limit).toBe(10);
  expect(res.docs).toHaveLength(3);
});

test('Should list all boys', async () => {
  const up = connection.getRepository(User);
  const res = await list(up, { where: { gender: 1 } });
  expect(res.total).toBe(2);
  expect(res.page).toBe(1);
  expect(res.pages).toBe(1);
  expect(res.limit).toBe(10);
  expect(res.docs).toHaveLength(2);
});

test('Should paginate with 1 record per page', async () => {
  const up = connection.getRepository(User);
  for (let i = 1; i <= 3; i++) {
    const res = await list(up, {}, { limit: 1, page: i });
    expect(res.total).toBe(3);
    expect(res.page).toBe(i);
    expect(res.pages).toBe(3);
    expect(res.limit).toBe(1);
    expect(res.docs).toHaveLength(1);
    expect(res.docs[0].id).toBe(i);
  }
});

test('Should paginate boys with 1 record per page', async () => {
  const up = connection.getRepository(User);
  for (let i = 1; i <= 2; i++) {
    const res = await list(up, { where: { gender: 1 } }, { limit: 1, page: i });
    expect(res.total).toBe(2);
    expect(res.page).toBe(i);
    expect(res.pages).toBe(2);
    expect(res.limit).toBe(1);
    expect(res.docs).toHaveLength(1);
    expect(res.docs[0].id).toBe(i);
  }
});

test('Should return an empty list when the page exceeds the maxmum', async () => {
  const up = connection.getRepository(User);
  const res = await list(up, {}, { limit: 1, page: 4 });
  expect(res.total).toBe(3);
  expect(res.page).toBe(4);
  expect(res.pages).toBe(3);
  expect(res.limit).toBe(1);
  expect(res.docs).toHaveLength(0);
});