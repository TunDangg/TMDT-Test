import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/entities/user.entity';

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

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @Column({ nullable: true })
  voucher_code: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0})
  discount_amount: number;

  @Column({
    type: 'enum', // Kiểu enum để giới hạn giá trị status chỉ có 'pending', 'processing', 'shipped', 'delivered'
    enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'], // Các trạng thái đơn hàng
    default: 'pending', // Mặc định là 'pending' khi tạo mới
  })
  status: string;

  @CreateDateColumn()
  created_at: Date; // Ngày tạo đơn hàng

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' }) // Tên cột khóa ngoại trong bảng orders
  user: User; // Mối quan hệ nhiều-một với User

  //Quan trọng: Phải có dòng này để OrderItem có thể trỏ tới 'items' trong Order
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[]; // Mối quan hệ một-nhiều với OrderItem
}
