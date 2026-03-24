import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findProfile(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      // Trả về đầy đủ thông tin hồ sơ, không bao gồm password
      select: ['id', 'username', 'role', 'email', 'phone', 'created_at'],
    });
    if (!user) throw new NotFoundException(`Không tìm thấy user có id là ${id}`);
    return user;
  }

  async update(id: number, updateData: any): Promise<User> {
    // Loại bỏ password để tránh việc vô tình ghi đè mật khẩu trắng hoặc sai định dạng
    const { id: _, password, ...dataToUpdate } = updateData;

    await this.usersRepository.update(id, dataToUpdate);

    // Sử dụng hàm findProfile đã có của bạn để lấy dữ liệu mới (đã ẩn password)
    return this.findProfile(id) as unknown as User;
  }
}
