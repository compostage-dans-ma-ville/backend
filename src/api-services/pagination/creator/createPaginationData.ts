import type { PaginatedData } from '../dto/PaginationData'
import { SortOrder } from '../dto/SortOrder'
import { createLinks } from './createLinks'

interface CreatePagindationDataParams<T> {
  url: URL | string,
  queryOptions: { page: number, items: number, sortOrder?: SortOrder },
  items: T[]
  totalItemCount: number,
}

const getEndpointOnly = (rawUrl: string | URL): URL => {
  const url = new URL(rawUrl.toString())
  return new URL(`${url.origin}${url.pathname}`)
}
export const createPaginationData = <T>({
  url,
  queryOptions,
  items,
  totalItemCount
}: CreatePagindationDataParams<T>): PaginatedData<T> => {
  const totalItems = totalItemCount > 0 ? totalItemCount : items.length
  const pageNumber = totalItemCount > 0 ? queryOptions.page : 1

  return {
    pagination: {
      pageNumber,
      pageSize: items.length,
      totalCount: totalItems
    },
    data: items,
    links: createLinks({
      baseUrl: getEndpointOnly(url),
      currentPage: pageNumber,
      itemCountPerPage: queryOptions.items,
      totalItemCount: totalItems,
      sortOrder: queryOptions.sortOrder
    })
  }
}
