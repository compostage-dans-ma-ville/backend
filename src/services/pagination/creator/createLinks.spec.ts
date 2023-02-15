import { createLinks } from './createLinks'

describe('createLinks', () => {
  it('link 50 items in 5 pages from the 1st page', () => {
    const links = createLinks({
      baseUrl: new URL('https://example.com'),
      currentPage: 1,
      itemCountPerPage: 10,
      totalItemCount: 50
    })

    expect(links).toMatchObject({
      first: 'https://example.com/?items=10&page=1',
      last: 'https://example.com/?items=10&page=5',
      next: 'https://example.com/?items=10&page=2'
    })
  })

  it('support a different URL', () => {
    const links = createLinks({
      baseUrl: new URL('https://another-url.com'),
      currentPage: 1,
      itemCountPerPage: 10,
      totalItemCount: 50
    })

    expect(links).toMatchObject({
      first: 'https://another-url.com/?items=10&page=1',
      last: 'https://another-url.com/?items=10&page=5',
      next: 'https://another-url.com/?items=10&page=2'
    })
  })

  it('link 51 items in 6 pages from the 1st page', () => {
    const links = createLinks({
      baseUrl: new URL('https://example.com'),
      currentPage: 1,
      itemCountPerPage: 10,
      totalItemCount: 51
    })

    expect(links).toMatchObject({
      first: 'https://example.com/?items=10&page=1',
      last: 'https://example.com/?items=10&page=6',
      next: 'https://example.com/?items=10&page=2'
    })
  })

  it('provide a previous page when the current page is different from the first', () => {
    const links = createLinks({
      baseUrl: new URL('https://example.com'),
      currentPage: 2,
      itemCountPerPage: 10,
      totalItemCount: 50
    })

    expect(links.prev).toEqual('https://example.com/?items=10&page=1')
  })

  it('provide a next page when the current page is different from the last', () => {
    const links = createLinks({
      baseUrl: new URL('https://example.com'),
      currentPage: 3,
      itemCountPerPage: 10,
      totalItemCount: 50
    })

    expect(links.next).toEqual('https://example.com/?items=10&page=4')
  })

  it('no next page on the last page', () => {
    const links = createLinks({
      baseUrl: new URL('https://example.com'),
      currentPage: 5,
      itemCountPerPage: 10,
      totalItemCount: 50
    })

    expect(links.next).toBeUndefined()
  })

  it('no previous page on the first page', () => {
    const links = createLinks({
      baseUrl: new URL('https://example.com'),
      currentPage: 1,
      itemCountPerPage: 10,
      totalItemCount: 50
    })

    expect(links.prev).toBeUndefined()
  })
})
