import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService { 
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    return await this.prisma.posts.create({data: createPostDto,});
  }

  async findAll() {
    return await this.prisma.posts.findMany();
  }


  async findOne(id: number) {
    //findUniqueOrThrow : metodo con eliminacion auto
    return await this.prisma.posts.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, title: UpdatePostDto) {
    return await this.prisma.posts.update({
      where: { id },
      data: title
    });
    // return { message : 'Post actualizado exitosamente',
    //   post: updatePost,
    // }
  }


  async remove(id: number) {
    await this.prisma.posts.delete({
      where: { id },
    });
    return {
      message: 'deleted successfully',
    };
  }
}