import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const { method, url } = req;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - startedAt;
          this.logger.log(`${method} ${url} → ${res.statusCode} (${ms}ms)`);
        },
      }),
    );
  }
}
