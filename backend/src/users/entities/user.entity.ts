import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

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

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum', // Kiểu enum để giới hạn giá trị role chỉ có 'user' hoặc 'admin'
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn() // Thêm để hiển thị "Ngày gia nhập" trên giao diện
  created_at: Date;

  @OneToMany(() => Order, (order) => order.user) // Mối quan hệ một-nhiều với Order
  orders: Order[]; // Một user có thể có nhiều đơn hàng
}
