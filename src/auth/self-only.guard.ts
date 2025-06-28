import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SelfOnlyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const targetId = context.switchToHttp().getRequest().params.id;
    const selfId = context.switchToHttp().getRequest().user.id;
    return targetId === selfId;
  }
}
