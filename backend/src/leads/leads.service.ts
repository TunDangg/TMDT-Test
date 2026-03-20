import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from './entities/lead.entity';
import { LeadActivity } from './entities/lead-activity.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,

    @InjectRepository(LeadActivity)
    private leadActivityRepository: Repository<LeadActivity>,
  ) {}

  // Tạo một lead mới
  create(createLeadDto: CreateLeadDto) {
    const newLead = this.leadRepository.create(createLeadDto);
    return this.leadRepository.save(newLead);
  }

  // Lấy tất cả leads cho admin
  findAll() {
    return this.leadRepository.find({
      relations: ['activities'],
      order: { created_at: 'DESC' },
    });
  }

  // Lấy chi tiết Lead kèm theo toàn bộ lịch sử
  async findOne(id: number) {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['activities'],
      order: {
        created_at: 'DESC',
        activities: { created_at: 'DESC' },
      },
    });

    if (!lead) {
      throw new NotFoundException(`không tim thấy khách hàng id ${id}`);
    }
    return lead;
  }

  // Lưu một dòng ghi chú mới
  async addActivity(leadId: number, content: string, type: string = 'note', role: string = 'Admin' ): Promise<LeadActivity> {
    const lead = await this.leadRepository.findOneBy({ id: leadId });
    if (!lead) {
      throw new NotFoundException(`không tim thấy khách hàng id ${leadId}`);
    }

    // Tạo dòng lịch sử mới và gắn cho lead tìm được
    const newActivity = await this.leadActivityRepository.create({
      content,
      type,
      role,
      lead,
    });

    return this.leadActivityRepository.save(newActivity);
  }

  // Cập nhật toàn bộ thông tin Lead
  async update(id: number, updateData: any) {
    await this.leadRepository.update(id, updateData);
    return this.leadRepository.findOneBy({ id });
  }

  // Xóa lead
  async remove(id: number) {
    return this.leadRepository.delete(id);
  }
  // // Cap nhat trang thai hoac ghi chu cua lead
  // async updateStatus(id: number, status: LeadStatus, notes?: string) {
  //   const lead = await this.leadRepository.findOneBy({ id });
  //   if (lead) {
  //     lead.status = status;
  //     if (notes) {
  //       lead.notes = notes;
  //     }
  //     return this.leadRepository.save(lead);
  //   }
  //   return null;
  // }
}
