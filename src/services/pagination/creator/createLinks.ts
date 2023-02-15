import { Links } from '../dto/Links'
import { SortOrder } from '../SortOrder'

const getLinkUrl = (baseUrl: URL, page: number): string => {
  const url = new URL(baseUrl)
  url.searchParams.append('page', page.toString())
  return url.toString()
}

interface CreateLinksSectionParams {
  baseUrl: URL,
  currentPage: number,
  itemCountPerPage: number,
  totalItemCount: number,
  sortOrder?: SortOrder
}
export const createLinks = ({
  baseUrl,
  currentPage,
  itemCountPerPage,
  totalItemCount,
  sortOrder
}: CreateLinksSectionParams): Links => {
  const maxPages = Math.ceil(totalItemCount / itemCountPerPage)

  const url = new URL(baseUrl)
  url.searchParams.append('items', itemCountPerPage.toString())
  if (sortOrder === SortOrder.ASC) {
    url.searchParams.append('sortOrder', 'ASC')
  }

  const linkFactory = (page: number): string => getLinkUrl(url, page)

  const links: Links = {
    first: linkFactory(1),
    last: linkFactory(maxPages)
  }

  if (currentPage > 1 && currentPage <= maxPages) {
    links.prev = linkFactory(currentPage - 1)
  }
  if (currentPage < maxPages) {
    links.next = linkFactory(currentPage + 1)
  }
  return links
}
