import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class NotFoundInterceptor<T> implements NestInterceptor {
  constructor(private message: string | undefined) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T | NotFoundException> {
    return next.handle()
      .pipe(
        catchError((err) => {
          if (err.code === 'P2025') {
            return throwError(() => new NotFoundException(this.message))
          }
          return throwError(() => err)
        })
      )
  }
}
