import { Controller, Get, Post, Delete, Body, Patch, Param } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadStatus } from './entities/lead.entity';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // Lấy toàn bộ leads (dành cho admin)
  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  // Lấy chi tiết khách hàng
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(+id);
  }

  // Thêm mới 1 khách hàng tiềm năng
  @Post()
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  // Tạom ghi chú mới
  @Post(':id/activities')
  addActivities(
    @Param('id') id: string,
    @Body('content') content: string,
    @Body('type') type: string,
  ) {
    return this.leadsService.addActivity(+id, content, type);
  }

  // Cập nhật toàn bộ thông tin Lead
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.leadsService.update(+id, updateData);
  }

  // Xóa lead
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(+id);
  }

  // Cập nhật trạng thái hoặc ghi chú của lead
  // @Patch(':id/status')
  // updateStatus(
  //   @Param('id') id: string,
  //   @Body('status') status: LeadStatus,
  //   @Body('notes') notes?: string,
  // ) {
  //   return this.leadsService.updateStatus(+id, status, notes);
  // }
}
