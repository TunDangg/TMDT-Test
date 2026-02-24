import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Bảo TypeOrm tạo bảng tên 'users' trong tmdt_db
export class User {
  @PrimaryGeneratedColumn() // Cột ID tự tăng
  id: number;

  @Column({ unique: true }) // Username duy nhất, không được trùng
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // Phần quyền : mặc định đang là user
  role: string;

}
