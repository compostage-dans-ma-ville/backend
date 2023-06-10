import { isAllDefinedOrUndefined } from './isAllDefinedOrUndefined'

describe('isAllDefinedOrUndefined', () => {
  it('returns the object if all defined', () => {
    const payload = { a: 0 }
    expect(isAllDefinedOrUndefined(payload)).toBe(payload)
  })

  it('returns the object if the one property is undefined', () => {
    const payload = { a: undefined }
    expect(isAllDefinedOrUndefined(payload)).toBe(payload)
  })

  it('returns the object if all number defined', () => {
    const payload = { a: 0, b: 0, c: 1 }
    expect(isAllDefinedOrUndefined(payload)).toBe(payload)
  })

  it('returns the object if all 3 number, array and object are defined', () => {
    const payload = { a: 0, b: [], c: {} }
    expect(isAllDefinedOrUndefined(payload)).toBe(payload)
  })

  it('returns undefined if 1 out of 3 is undefined', () => {
    const payload = { a: 0, b: [], c: undefined }
    expect(isAllDefinedOrUndefined(payload)).toBe(undefined)
  })

  it('returns undefined if only one property is defined', () => {
    const payload = {
      a: undefined, b: undefined, c: 0, d: undefined, e: undefined
    }
    expect(isAllDefinedOrUndefined(payload)).toBe(undefined)
  })

  it('returns the object if all 3 properties are undefined', () => {
    const payload = { a: undefined, b: undefined, c: undefined }
    expect(isAllDefinedOrUndefined(payload)).toBe(payload)
  })
})
