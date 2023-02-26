import type { Request } from 'express'

export const getEndpoint = (req: Request): string => `${req.protocol}://${req.get('Host')}${req.url}`
