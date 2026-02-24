import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// import { un } from 'vue-router/dist/router-CWoNjPRp'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Inject repository của entity User
    private usersRepository: Repository<User>, // Sử dụng repository để thao tác với bảng users
  ) {}
  findAll() {
    return this.usersRepository.find();
  }

  async create(username: string, password: string) {
    // Thêm dòng console.log này để kiểm tra xem dữ liệu có vào đến đây không
    console.log('Đang tạo user:', username);

    const salt = await bcrypt.genSalt(); // Tạo salt để băm mật khẩu

    const hashedPassword = await bcrypt.hash(password, salt); // Băm mật khẩu với salt

    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser); // Lưu user mới vào database
  }

  // Hàm này để tìm user theo username
  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }
}
