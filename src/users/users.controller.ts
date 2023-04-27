import { ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { USESR_GROUP, USESR_DETAIL } from './entity/user.entity';
import { JwtAuthGuard } from 'auth/guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @UseGuards(JwtAuthGuard) // Check user valid access token
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ groups: [USESR_GROUP] })
  @Get('/all')
  async getAll(): Promise<any> {
    return await this.usersService.findAll();
  }
  
  @UseGuards(JwtAuthGuard) // Check user valid access token
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ groups: [USESR_DETAIL] })
  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) userId: number): Promise<any> {
    const user = await this.usersService.findOneById(userId);
    
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return user;
  }
}
