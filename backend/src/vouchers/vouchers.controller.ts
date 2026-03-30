import { Body, Controller, Post, HttpStatus, HttpCode, Get, Param, Put, Delete } from '@nestjs/common';
import { VouchersService } from './vouchers.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Body() body: { code: string; cart_total: number }) {
    return this.vouchersService.validateVoucher(body.code, Number(body.cart_total));
  }

  @Get()
  findAll() {
    return this.vouchersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vouchersService.findOne(+id);
  }

  @Post()
  create(@Body() createVoucherDto: any) {
    return this.vouchersService.create(createVoucherDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateVoucherDto: any) {
    return this.vouchersService.update(+id, updateVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vouchersService.remove(+id);
  }
}
