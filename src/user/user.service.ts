import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //! VER POR CAMPOS SELECCIONADOS

  // async findAll() {
  //   return await this.prisma.users.findMany({
  //     include: {
  //       posts: { // Relación a la tabla pivote UsersPosts
  //         select: {
  //           createdAt: true, // Puedes incluir createdAt si lo necesitas
  //           posts: {         // Los detalles del post asociado
  //             select: {
  //               id: true,    // ID del post
  //               title: true, // Título del post
  //               content: true, // Contenido del post
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }


  //! VER TODOS LOS CAMPOS
  async findAll() {
    return await this.prisma.users.findMany({
      include: {
        posts: {
          select: {
            createdAt: true, // Solo los campos de la relación, no los del post
            posts: true, // Incluir todos los campos del post
          },
        },
      },
    });
  }
  
  
  async create(createUserDto: CreateUserDto) {
    console.log("Received DTO in controller:", createUserDto);
    return await this.prisma.users.create({ data: createUserDto });
  }

  
  async findOne(id: number) {
    //findUniqueOrThrow : metodo con eliminacion auto
    return await this.prisma.users.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: number, { firstName, lastName}: UpdateUserDto) {
    return await this.prisma.users.update({
      where: { id },
      data: { firstName, lastName }
    });
    // return { message : 'Post actualizado exitosamente',
    //   post: updatePost,
    // }
  }

  async remove(id: number) {
    await this.prisma.users.delete({
      where: { id },
    });
    return {
      message: 'deleted successfully',
    };
  }


  async assignPostsToUser(userId: number, postIds: number[]) {
    // Verificar si el usuario existe
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
  
    // Crear las relaciones en la tabla pivote `UserPosts` y retornar los posts asociados
    await this.prisma.usersPosts.createMany({
      data: postIds.map(postId => ({ userId, postId })),
      skipDuplicates: true,
    });
  
    return await this.prisma.posts.findMany({
      where: { id: { in: postIds } },
    });
  }
  

}

