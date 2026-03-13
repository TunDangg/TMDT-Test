import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTING = 'CONTACTING',
  CONTACTED = 'CONTACTED',
  OPPORTUNITY = 'OPPORTUNITY',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  // Nguồn khách hàng (ví dụ: Facebook, Google Ads, Referral, v.v.)
  @Column({ nullable: true })
  source: string;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  // Admin có thể thêm ghi chú về khách hàng
  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

