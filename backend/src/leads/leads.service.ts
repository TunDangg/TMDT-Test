import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from './entities/lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  // Tạo một lead mới
  create(createLeadDto: CreateLeadDto) {
    const newLead = this.leadRepository.create(createLeadDto);
    return this.leadRepository.save(newLead);
  }

  // Lấy tất cả leads cho admin
  findAll() {
    return this.leadRepository.find({ order: { created_at: 'DESC' } });
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
  // Cap nhat trang thai hoac ghi chu cua lead
  async updateStatus(id: number, status: LeadStatus, notes?: string) {
    const lead = await this.leadRepository.findOneBy({ id });
    if (lead) {
      lead.status = status;
      if (notes) {
        lead.notes = notes;
      }
      return this.leadRepository.save(lead);
    }
    return null;
  }
}
