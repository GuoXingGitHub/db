[![Build Status](https://travis-ci.org/corelink-shenzhen/db.svg?branch=master)](https://travis-ci.org/corelink-shenzhen/db.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/corelink-shenzhen/db/badge.svg?branch=master)](https://coveralls.io/github/corelink-shenzhen/db?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Typeorm 相关工具

## list
从数据库中列出数据

### 定义
```ts
/**
 * 列出表数据
 * @param repo Typeorm 的 Repository
 * @param listOptions 列表配置
 * @param paginate 分页配置（默认第1页，默示10条）
 */
export async function list<T>(
  repo: Repository<T>,
  listOptions: FindManyOptions<T> = {},
  paginate: IPaginateOptions = { limit: 10, page: 1 },
): Promise<IListResult<T>>

export interface IPaginateOptions {
  /**
   * 每显示条数
   */
  limit: number;

  /**
   * 显示的页数角标
   */
  page: number;
}

export interface IPaginateResult extends IPaginateOptions {
  /**
   * 总页数
   */
  pages: number;

  /**
   * 总条数
   */
  total: number;
}

export interface IListResult<T> extends IPaginateResult {
  /**
   * 数据列表
   */
  docs: T[];
}
```

### 使用方法
默认配置列出（不过滤，列出第1页，每页10条。）
```ts
import { list } from '@corelink/db';

const up = connection.getRepository(User);
const res = await list(up);

```
只列出男孩
```ts
import { list } from '@corelink/db';

const up = connection.getRepository(User);
const res = await list(up, { where: { gender: 1 } });
```
每页1条，列出第2页
```ts
import { list } from '@corelink/db';

const up = connection.getRepository(User);
const res = await list(up, {}, { limit: 1, page: 2 });
```

更多例子请参考`__tests__`目录下的`list-spec.ts`
