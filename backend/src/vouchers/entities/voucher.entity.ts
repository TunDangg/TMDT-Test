import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'enum', enum: ['percent', 'fixed'] })
  discount_type: 'percent' | 'fixed';

  @Column('decimal', { precision: 10, scale: 2 })
  discount_value: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  min_order_value: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  max_discount_amount: number;

  @Column({ type: 'timestamp' })
  expiry_date: Date;

  @Column({ default: 1 })
  usage_limit: number;

  @Column({ default: 0 })
  used_count: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
