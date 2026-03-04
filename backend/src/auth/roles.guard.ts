import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lay danh sach cac role duoc yeu cau tu Decorator @Roles() tren handler
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Neu khong co role nao duoc yeu cau, cho phep truy cap
    }
    const { user } = context.switchToHttp().getRequest(); // Lay thong tin user tu request
    // user.role nay duoc lay ra sau khi JwtStrategy da xac thuc token va gan thong tin user vao request
    return requiredRoles.includes(user.role);
  }
}
