// định nghĩa cấu trúc bảng trong database
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  price: number;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true, length: '500' })
  image_url: string;

  @CreateDateColumn({ type: 'timestamp' }) // Tự động lưu thời gian tạo khi bản ghi được tạo
  created_at: Date;
}
