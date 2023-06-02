import { Injectable, PipeTransform } from '@nestjs/common'
import { Express } from 'express'
import * as path from 'path'
import sharp from 'sharp'

@Injectable()
export class AvatarSharpPipe implements PipeTransform<Express.Multer.File, Promise<{}>> {
  async transform(image: Express.Multer.File): Promise<{}> {
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
    const filename = randomName + '.webp'
    const dest = path.join('uploaded-pictures', 'avatar', filename)

    await sharp(image.buffer)
      .resize(800)
      .webp({ effort: 3 })
      .toFile(dest)

    return randomName
  }
}
