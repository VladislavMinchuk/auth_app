import { ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { USESR_GROUP, USESR_DETAIL } from './entity/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ groups: [USESR_GROUP] })
  @Get('/all')
  getAll() {
    return this.usersService.findAll();
  }
  
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ groups: [USESR_DETAIL] })
  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.usersService.findOneById(userId);
    
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return user;
  }
}
