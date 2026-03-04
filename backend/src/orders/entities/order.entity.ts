import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn() // Cột ID tự tăng
  id: number;

  @Column()
  customer_name: string;

  @Column()
  customer_phone: string;

  @Column()
  customer_address: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @Column({ default : 'pending' }) // Trạng thái đơn hàng, mặc định là 'pending'
  status: string; // pending, processing, completed, cancelled

  @CreateDateColumn()
  created_at: Date; // Ngày tạo đơn hàng

  @OneToMany(() => OrderItem, (item) => item.order_items, { cascade: true })
  order_items: OrderItem[]; // Mối quan hệ một-nhiều với OrderItem
}
