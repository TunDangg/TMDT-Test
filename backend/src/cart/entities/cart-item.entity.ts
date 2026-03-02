import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
@Unique(['userId', 'productId']) // Đảm bảo mỗi người dùng chỉ có một dòng cho mỗi sản phẩm trong giỏ hàng
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  //Moi dong gio hang se thuoc ve 1 nguoi dung
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ default: 1 })
  quantity: number;

  //Moi dong gio hang se thuoc ve 1 san pham
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
