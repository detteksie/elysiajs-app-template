import {
  IPaginationOptions,
  ObjectLiteral,
  // PaginationTypeEnum,
  // TypeORMCacheType,
} from './interfaces';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export function resolveOptions<CustomMetaType extends ObjectLiteral>(
  options: IPaginationOptions<CustomMetaType>,
  // ): [number, number, string, PaginationTypeEnum, boolean, TypeORMCacheType] {
): [number, number, string, boolean] {
  const page = resolveNumericOption(options, 'page', DEFAULT_PAGE);
  const limit = resolveNumericOption(options, 'limit', DEFAULT_LIMIT);
  const route = options.route!;
  // const paginationType = options.paginationType || PaginationTypeEnum.LIMIT_AND_OFFSET;
  const countQueries = typeof options.countQueries !== 'undefined' ? options.countQueries : true;
  // const cacheQueries = options.cacheQueries || false;

  // return [page, limit, route, paginationType, countQueries, cacheQueries];
  return [page, limit, route, countQueries];
}

export function resolveNumericOption<CustomMetaType extends ObjectLiteral>(
  options: IPaginationOptions<CustomMetaType>,
  key: 'page' | 'limit',
  defaultValue: number,
): number {
  const value = options[key];
  const resolvedValue = Number(value);

  if (Number.isInteger(resolvedValue) && resolvedValue >= 0) return resolvedValue;

  console.warn(
    `Query parameter "${key}" with value "${value}" was resolved as "${resolvedValue}", please validate your query input! Falling back to default "${defaultValue}".`,
  );
  return defaultValue;
}
