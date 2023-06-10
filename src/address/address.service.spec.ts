import { Test, TestingModule } from '@nestjs/testing'
import { AddressService } from './address.service'

describe('AddressService', () => {
  let service: AddressService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressService]
    }).compile()

    service = module.get<AddressService>(AddressService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getBBoxFrom()', () => {
    it('returns the expected BBox with coords from Toulouse - Réseau Composte Citoyen (+20.5%)', () => {
      const r = AddressService.getBBoxFrom(43.64670981944473, 1.4395336779514336, 10000)
      expect(r).toMatchObject({
        maxLat: 1.5293530532658752,
        maxLong: 43.73652919475917,
        minLat: 1.349714302636992,
        minLong: 43.55689044413029
      })
    })

    it('returns the expected BBox with coords from Brest - Base navale de Brest Porte Carafelli (+20%)', () => {
      const r = AddressService.getBBoxFrom(48.3810436357234, -4.504044432095757, 10000)
      expect(r).toMatchObject({
        maxLat: -4.414225056781315,
        maxLong: 48.47086301103784,
        minLat: -4.593863807410199,
        minLong: 48.29122426040896
      })
    })

    it('returns the expected BBox with coords from Rouen - Halle aux toiles (+19%)', () => {
      const r = AddressService.getBBoxFrom(49.43811983935485, 1.0947473820580844, 10000)
      expect(r).toMatchObject({
        maxLat: 1.184566757372526,
        maxLong: 49.52793921466929,
        minLat: 1.0049280067436428,
        minLong: 49.348300464040406
      })
    })
  })
})
