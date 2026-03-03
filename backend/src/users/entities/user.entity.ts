import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users') // Bảo TypeOrm tạo bảng tên 'users' trong tmdt_db
export class User {
  @PrimaryGeneratedColumn() // Cột ID tự tăng
  id: number;

  @Column({ unique: true }) // Username duy nhất, không được trùng
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum', // Kiểu enum để giới hạn giá trị role chỉ có 'user' hoặc 'admin'
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

}
