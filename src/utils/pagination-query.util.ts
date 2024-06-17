export class PaginationQuery {
  declare page: number;
  declare limit: number;
}

type DefaultQuery = {
  page?: number;
  minPage?: number;
  limit?: number;
  minLimit?: number;
};
const defaultQuery: DefaultQuery = {
  page: 1,
  minPage: 1,
  limit: 10,
  minLimit: 5,
};

export function checkPaginationDefault(
  query: Record<string, string | undefined>,
  value: DefaultQuery = defaultQuery,
) {
  if (!query['page'] || +query['page'] < value.minPage!) query['page'] = value.page?.toString();
  if (!query['limit'] || +query['limit'] < value.minLimit!)
    query['limit'] = value.limit?.toString();
}

// export const getPaginationQuery = (c: Context) => {
export const getPaginationQuery = (c: any) => {
  const user = c.get('pagination');
  return user;
};
