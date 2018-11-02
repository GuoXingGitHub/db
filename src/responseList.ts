import { Request, Response } from 'express';
import { FindOptions } from 'typeorm';
import { IPaginateOptions, IListResult } from './list';

export const CORELINK_KEY_LIST_OPTIONS = 'x-corelink-list-options';
export const CORELINK_KEY_PAGINATE = 'x-corelink-paginate';
export const CORELINK_DEFAULT_PAGINATE_LIMIT = 10;
export const CORELINK_DEFAULT_PAGINATE_PAGE = 1;

export function generateListOptions<T>(req: Request): FindOptions<T> {
  const coreLinkListOptions = req.headers[CORELINK_KEY_LIST_OPTIONS] as string;
  return coreLinkListOptions
    ? JSON.parse(decodeURIComponent(coreLinkListOptions))
    : {};
}

export function generatePaginate(req: Request): IPaginateOptions {
  const coreLinkPaginate = req.headers[CORELINK_KEY_PAGINATE] as string;
  return coreLinkPaginate
    ? JSON.parse(coreLinkPaginate)
    : {
        limit: CORELINK_DEFAULT_PAGINATE_LIMIT,
        page: CORELINK_DEFAULT_PAGINATE_PAGE,
      };
}

export async function responseList<T>(
  code: number,
  response: Response,
  result: IListResult<T>
) {
  response.setHeader(
    CORELINK_KEY_PAGINATE,
    JSON.stringify({
      total: result.total,
      pages: result.pages,
      page: result.page,
      limit: result.limit,
    })
  );
  response.setHeader('Access-Control-Expose-Headers', CORELINK_KEY_PAGINATE);
  response.status(code).json(result.docs);
}
