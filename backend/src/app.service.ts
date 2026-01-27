import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'Kết nối thành công!',
      user: 'Tuấn Đăng',
      role: 'IT Intern',
    };
  }
}
