// định nghĩa cấu trúc bảng trong database
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true, type: 'text' })
  image_url: string;
}
