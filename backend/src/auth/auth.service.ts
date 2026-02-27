import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/entities/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    //1. tìm user có trong database hay không
    const user = await this.usersService.findOneByUsername(username);

    //2. Kiểm tra user có tồn tại không
    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    //3. Nếu tìm thấy thì lấy mật khẩu vừa nhập so sánh với mật khẩu trong database
    const isMatch = await bcrypt.compare(password, user.password);

    //4. nếu mật khẩu không đúng thì báo
    if (!isMatch) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    //5. nếu đúng thì trả về thông tin user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user; // Loại bỏ trường password khỏi đối tượng user trả về

    // Tạo JWT token
    const payload = { sub: user.id, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Đăng nhập thành công',
      access_token,
      user: result,
    };
  }
}
