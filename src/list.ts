import { Repository, FindOptions } from 'typeorm';

/**
 * 列出表数据
 * @param repo Typeorm 的 Repository
 * @param listOptions 列表配置
 * @param paginate 分页配置（默认第1页，默示10条）
 */
export async function list<T>(
  repo: Repository<T>,
  listOptions: FindOptions<T> = {},
  paginate: IPaginateOptions = { limit: 10, page: 1 }
): Promise<IListResult<T>> {
  const options: FindOptions<T> = { ...listOptions };
  const total = await repo.count(options.where || {});
  const limit = paginate.limit;
  const page = paginate.page;
  const pages = Math.ceil(total / paginate.limit);
  options.skip = limit * (page - 1);
  options.take = limit;
  const docs = await repo.find(options);
  return {
    docs,
    total,
    pages,
    page,
    limit,
  };
}

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
