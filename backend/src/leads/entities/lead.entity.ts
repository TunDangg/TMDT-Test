import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { LeadActivity } from './lead-activity.entity';

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
  address: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  // Nguồn khách hàng (ví dụ: Facebook, Google Ads, Referral, v.v.)
  @Column({ nullable: true })
  source: string;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => LeadActivity, (activity) => activity.lead, { cascade: true })
  activities: LeadActivity[];
}

