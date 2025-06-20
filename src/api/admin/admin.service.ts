import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/core/entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity) private readonly adminRep: Repository<AdminEntity>
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    try {
      const existsEmail = await this.adminRep.findOne({ where: { email: createAdminDto.email }});
      if (existsEmail ) {
        throw new ConflictException('Email address already exists')
      }
      const existsPhone = await this.adminRep.findOne({ where: { phone_number: createAdminDto.phone_number }});
      if(existsPhone) {
        throw new ConflictException('Phone number already exists');
      };
      const admin = this.adminRep.create(createAdminDto);
      await this.adminRep.save(admin);
      return admin;

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const admins = await this.adminRep.find();
      return admins;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const admin = await this.adminRep.findOneBy({id});
      if(!admin) {
        throw new NotFoundException('Admin not found');
      };
      return admin;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      
      const existingAdmin = await this.adminRep.findOneBy({ id });

      if (!existingAdmin) {
        throw new NotFoundException('Admin not found');
      }
      if (
        updateAdminDto.email &&
        updateAdminDto.email !== existingAdmin.email
      ) {
        const emailExists = await this.adminRep.findOneBy({
        email: updateAdminDto.email,
      });

      if (emailExists) {
          throw new BadRequestException('Email already exists');
        }
      }
    if (
      updateAdminDto.phone_number &&
      updateAdminDto.phone_number !== existingAdmin.phone_number
    ) {
      const phoneExists = await this.adminRep.findOneBy({
        phone_number: updateAdminDto.phone_number,
      });

      if (phoneExists) {
        throw new BadRequestException('Phone number already exists');
      }
    }
      await this.adminRep.update({ id }, updateAdminDto);
      const admin = this.adminRep.findOneBy({ id });
      if(!admin) {
        throw new NotFoundException('Admin not found');
      };
      return admin;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const admin = this.adminRep.delete(id);
      if(!admin) {
        throw new NotFoundException('Admin not found')
      };
      return {
        message: "success"
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
