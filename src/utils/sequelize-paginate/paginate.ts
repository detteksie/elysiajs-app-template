import { Attributes, FindAndCountOptions, Model, ModelStatic } from 'sequelize';

import {
  IPaginationMeta,
  IPaginationOptions,
  ObjectLiteral,
  // PaginationTypeEnum,
  // TypeORMCacheType,
  createPaginationObject,
  resolveOptions,
} from '../paginate';

export async function sequelizePaginate<
  M extends Model,
  CustomMetaType extends ObjectLiteral = IPaginationMeta,
>(
  model: ModelStatic<M>,
  options: IPaginationOptions<CustomMetaType>,
  searchOptions?: Omit<FindAndCountOptions<Attributes<M>>, 'group'>,
) {
  const [page, limit, route] = resolveOptions(options!);

  const { rows: items, count: total } = await model.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    ...searchOptions,
  });

  return createPaginationObject<M, CustomMetaType>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    route,
    metaTransformer: options?.metaTransformer,
    routingLabels: options?.routingLabels,
  });
}
