import { ForbiddenError } from '@casl/ability'
import {
  ExceptionFilter, Catch, ArgumentsHost, HttpStatus
} from '@nestjs/common'

@Catch(ForbiddenError)
export class AbilityExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: ForbiddenError<any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    // @ts-expect-error
    response.status(HttpStatus.FORBIDDEN)
      .json({
        statusCode: HttpStatus.FORBIDDEN,
        message: exception.message
      })
  }
}
