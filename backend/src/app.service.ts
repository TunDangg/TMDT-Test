import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'Kết nối thành công!',
      user: 'Trần Tuấn Đăng',
      role: 'Admin',
    };
  }
}
