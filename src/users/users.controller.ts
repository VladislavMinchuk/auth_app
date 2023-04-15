import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, SerializeOptions, UseInterceptors } from '@nestjs/common';
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
  getById(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.findOneById(userId);
  }
}
