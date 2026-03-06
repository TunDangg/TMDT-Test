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

  @Column({
    type: 'enum', // Kiểu enum để giới hạn giá trị status chỉ có 'pending', 'processing', 'shipped', 'delivered'
    enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'], // Các trạng thái đơn hàng
    default: 'pending', // Mặc định là 'pending' khi tạo mới
  })
  status: string;

  @CreateDateColumn()
  created_at: Date; // Ngày tạo đơn hàng

  //Quan trọng: Phải có dòng này để OrderItem có thể trỏ tới 'items' trong Order
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[]; // Mối quan hệ một-nhiều với OrderItem
}
