import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import {
  Observable,
  TimeoutError,
  throwError,
  timeout,
  catchError,
} from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const customTimeout = this.reflector.get<number>(
      'timeout',
      context.getHandler(),
    );

    const appliedTimeout = customTimeout ?? 3000;

    return next.handle().pipe(
      timeout(appliedTimeout),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new Error('Request timed out'));
        }
        return throwError(() => err);
      }),
    );
  }
}
