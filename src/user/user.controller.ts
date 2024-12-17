import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto){
    return await this.userService.create(createUserDto)
  }

  @Get(':id')
  async findOne(@Param('id') id:number){
    return await this.userService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto){
    return await this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }

  @Post(':userId/posts')
  async assignPostsToUser(@Param('userId') userId: number, @Body() postIds: number[]) {
    return await this.userService.assignPostsToUser(userId, postIds);
  }
}
