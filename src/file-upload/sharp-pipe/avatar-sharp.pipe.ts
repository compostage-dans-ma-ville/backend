import {
  HttpException, HttpStatus, Injectable, PipeTransform
} from '@nestjs/common'
import { Express } from 'express'
import * as path from 'path'
import sharp from 'sharp'

@Injectable()
export class AvatarSharpPipe implements PipeTransform<Express.Multer.File, Promise<{}>> {
  async transform(image: Express.Multer.File): Promise<{}> {
    // Allowed file size in mb
    const maxFileSize: number = 1
    const fileSize: number = (image.size / (1024 * 1024))

    if (fileSize > maxFileSize) {
      throw new HttpException(
        `File is too big: size limit = ${maxFileSize} mb; file size = ${fileSize} mb`,
        HttpStatus.BAD_REQUEST
      )
    }

    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
    const filename = randomName + '.webp'
    const dest = path.join('uploaded-pictures', 'avatar', filename)
    try {
      await sharp(image.buffer)
        .resize(800)
        .webp({ effort: 3 })
        .toFile(dest)
    } catch (e) {
      throw new HttpException(
        'File is an unsupported image format',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE
      )
    }

    return randomName
  }
}