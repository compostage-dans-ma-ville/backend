import { createPaginationData } from './createPaginationData'

describe('createLinks', () => {
  it('return the 2 items from the first page', () => {
    const data = ['a', 'b', 'c']
    const paginatedData = createPaginationData({
      url: new URL('https://example.com'),
      queryOptions: { sortOrder: 'ASC', items: 2, page: 1 },
      items: data,
      totalItemCount: 50
    })

    expect(paginatedData).toEqual({
      pagination: { pageNumber: 1, pageSize: 3, totalCount: 50 },
      data,
      links: {
        first: 'https://example.com/?items=2&sortOrder=ASC&page=1',
        last: 'https://example.com/?items=2&sortOrder=ASC&page=25',
        next: 'https://example.com/?items=2&sortOrder=ASC&page=2'
      }
    })
  })

  it('return the 3 items in the first page', () => {
    const data = ['a', 'b', 'c', 'd']
    const paginatedData = createPaginationData({
      url: new URL('https://example.com'),
      queryOptions: { sortOrder: 'ASC', items: 3, page: 1 },
      items: data,
      totalItemCount: 50
    })

    expect(paginatedData).toEqual({
      pagination: { pageNumber: 1, pageSize: 4, totalCount: 50 },
      data,
      links: {
        first: 'https://example.com/?items=3&sortOrder=ASC&page=1',
        last: 'https://example.com/?items=3&sortOrder=ASC&page=17',
        next: 'https://example.com/?items=3&sortOrder=ASC&page=2'
      }
    })
  })

  it('return the all 3 items', () => {
    const data = ['a', 'b', 'c']
    const paginatedData = createPaginationData({
      url: new URL('https://example.com'),
      queryOptions: { sortOrder: 'ASC', items: 10, page: 1 },
      items: data,
      totalItemCount: data.length
    })

    expect(paginatedData).toEqual({
      pagination: { pageNumber: 1, pageSize: 3, totalCount: 3 },
      data,
      links: {
        first: 'https://example.com/?items=10&sortOrder=ASC&page=1',
        last: 'https://example.com/?items=10&sortOrder=ASC&page=1'
      }
    })
  })

  it('return all 6 items', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    const paginatedData = createPaginationData({
      url: new URL('https://example.com'),
      queryOptions: { sortOrder: 'ASC', items: 10, page: 1 },
      items,
      totalItemCount: items.length
    })

    expect(paginatedData).toEqual({
      pagination: { pageNumber: 1, pageSize: items.length, totalCount: items.length },
      data: items,
      links: {
        first: 'https://example.com/?items=10&sortOrder=ASC&page=1',
        last: 'https://example.com/?items=10&sortOrder=ASC&page=1'
      }
    })
  })
})
