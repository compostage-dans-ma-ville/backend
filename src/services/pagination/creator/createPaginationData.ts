import { URL } from 'url'
import { createLinks } from './createLinks'
import { PaginatedData } from '../dto/PaginationData'
import { ListQueryHandler } from '../query-param-handling-service'

interface CreatePagindationDataParams<T> {
  baseUrl: URL,
  queryOptions: ListQueryHandler,
  items: T[]
  totalItemCount: number,
}

export const createPaginationData = <T>({
  baseUrl,
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
      baseUrl,
      currentPage: pageNumber,
      itemCountPerPage: queryOptions.items,
      totalItemCount: totalItems,
      sortOrder: queryOptions.sortOrder
    })
  }
}
