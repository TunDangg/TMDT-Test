import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lead } from './lead.entity';

@Entity('lead_activities')
export class LeadActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  // Cột phân loại hoạt động: ghi chú thường (note), gọi điện (call), hoặc hệ thống (system)
  // Đặt giá trị mặc định là 'note'
  @Column({ default: 'note' })
  type: string;

  @Column({ default: 'Admin' })
  role: string;

  @ManyToOne(() => Lead, (lead) => lead.activities, { onDelete: 'CASCADE' })
  lead: Lead;

  @CreateDateColumn()
  created_at: Date;
}
