import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/core/entities/admin.entity';
import { DeepPartial, Repository } from 'typeorm';
import { AdminRepository } from 'src/core/repository/admin.repository';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { FileService } from '../file/file.service';
import { RoleAdmin } from 'src/common/enum';
import { SigninAdminDto } from './dto/signin-admin.dto';
import { BcryptEncryption } from 'src/infrastructure/lib/bcrypt/index'
import { generateOTP } from 'src/infrastructure/lib/otp-generator/generateOTP';
import { MailService } from 'src/infrastructure/lib/mail/mail.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfirmOTPDto } from './dto/confirm-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/config';
import { Response } from 'express';

@Injectable()
export class AdminService extends BaseService<CreateAdminDto, DeepPartial<AdminEntity>>{
  constructor(
    @InjectRepository(AdminEntity) private readonly adminRep: AdminRepository,
    private readonly fileService: FileService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { super(adminRep); }

  async createSuperAdmin(
  createAdminDto: CreateAdminDto,
  file?: Express.Multer.File | any
  ) {
    try {
      let photo = '';
      if(file) {
        photo = await this.fileService.createFile(file);
      };
      let superadmin = await this.getRepository.create({
        ...createAdminDto,
        photo,
        role: RoleAdmin.SUPERADMIN
      });
      superadmin = await this.getRepository.save(superadmin);
    } catch (error) {
      throw new BadRequestException(`Error on creating super admin: ${error}`);
    };
    return {
      status_code: 201,
      message: 'success',
      data: {},
    };
  };

  async createAdmin(
    createAdminDto: CreateAdminDto,
    file?: Express.Multer.File | any
  ) {
    let photo = '';
    if(file) {
      photo = await this.fileService.createFile(file);
    }
    const { email, phone_number, password } = createAdminDto;
    const exist_email = await this.getRepository.findOne({
      where: { email }
    });
    if(exist_email) {
      throw new ConflictException('Email already exists');
    };
    if(phone_number){
      const exist_phone = await this.getRepository.findOne({
        where: { phone_number },
      });
      if (exist_phone) {
        throw new ConflictException(`Phone number already exist`);
      }
    };
    try {
      const hashedPassword = await BcryptEncryption.encrypt(password);
      let admin = await this.getRepository.create({
        ...createAdminDto,
        password: hashedPassword,
        photo
      });
      admin = await this.getRepository.save(admin);
    } catch (error) {
      throw new BadRequestException(`Error on creating admin: ${error.message}`);
    };
    return {
      status_code: 201,
      message: 'success',
      data: {}
    };
  };

  async signin(signinDto: SigninAdminDto) {
    try {
      const { email, password } = signinDto;
      const admin = await this.adminRep.findOne({ where: { email }});
      if(!admin) {
        throw new BadRequestException('Eamil adress or passwrod incorrect');
      }
      const isMatchPassword = await BcryptEncryption.compare(password, admin.password)
      if (!isMatchPassword) {
        throw new BadRequestException('Email or password incorrect');
      };
      const otp = generateOTP();
      await this.mailService.sendOTP(email, String(otp));
      await this.cacheManager.set(email, otp, 120000);
      return {
        statusCode: 201,
        message: 'success',
        data: email
      }
    } catch (error) {
      throw new BadRequestException(`Error on creating admin: ${error.message}`);
    };
  };

  async confirmSignInAdmin(confirmOTPDto: ConfirmOTPDto, res: Response){
    try {
      const { email, otp } = confirmOTPDto;
      const admin = await this.adminRep.findOne({ where: { email }});
      if(!admin) {
        throw new BadRequestException('Wrong email adress');
      };
      const isTrueOtp = await this.cacheManager.get(email);
      if(!isTrueOtp || isTrueOtp != otp) {
        throw new BadRequestException('Otp expired');
      };
      const payload = { id: admin.id, role: admin.role };
      const { access_token, refresh_token } = await this.generateTokens(payload);
      await this.writeToCookie(refresh_token, res);
      admin.is_active = true
      return {
        statusCode: 200,
        message: 'success',
        data: {
          access_token,
          access_token_expire: config.ACCESS_TOKEN_TIME,
        refresh_token,
        refresh_token_expire: config.REFRESH_TOKEN_TIME,
        }
      }
    } catch (error) {
      throw new BadRequestException(`Error on confirm signin admin: ${error.message}`);
    }
  };

  async refreshToken(refresh_token: string) {
    let data: any;
    try {
      data = await this.jwtService.verify(refresh_token, {
        secret: config.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(`Error on refresh token: ${error}`);
    }
    await this.findOneById(data?.id);
    const payload = {
      id: data.id,
      role: data.role,
    };
    let access_token: any;
    try {
      access_token = await this.jwtService.signAsync(payload, {
        secret: config.ACCESS_TOKEN_KEY,
        expiresIn: config.ACCESS_TOKEN_TIME,
      });
    } catch (error) {
      throw new BadRequestException(`Error on generate access token: ${error}`);
    }
    return {
      status_code: 200,
      message: 'success',
      data: {
        token: access_token,
        expire: config.ACCESS_TOKEN_TIME,
      },
    };
  };

  async logout(refresh_token: string, res: Response) {
    let data: any;
    try {
      data = await this.jwtService.verify(refresh_token, {
        secret: config.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(`Error on refresh token: ${error}`);
    }
    await this.findOneById(data?.id);
    res.clearCookie('refresh_token_admin');
    return {
      status_code: 200,
      message: 'success',
      data: {},
    };
  };

  async editProfile(
    id: number,
    updateAdminDto: UpdateAdminDto,
    file?: Express.Multer.File | any
  ) {
    const admin = await this.getRepository.findOne({
      where: { id }
    });
    if(!admin) {
      throw new NotFoundException('Admin not found')
    };
    if(updateAdminDto.phone_number) {
      const exist_phone = await this.getRepository.findOne({
        where: { phone_number: updateAdminDto.phone_number }
      });
      if(exist_phone && exist_phone.id != id) {
        throw new ConflictException('Phone number already exists')
      };
    };
    if(updateAdminDto.email) {
      const exist_email = await this.getRepository.findOne({
        where: { email: updateAdminDto.email }
      });
      if(exist_email && exist_email.id != id) {
        throw new ConflictException('Email address already exists')
      };
    };
    let photo = admin.photo;
    if(file) {
      photo = await this.fileService.createFile(file);
      if (admin.photo && (await this.fileService.existFile(admin.photo))) {
        await this.fileService.deleteFile(admin.photo);
      }
    };
    try {
      await this.getRepository.update(id, {
        ...updateAdminDto,
        photo,
        updated_at: Date.now(),
      });
    } catch (error) {
      throw new BadRequestException(
        `Error on update profile of admin: ${error}`,
      );
    }
    const updated_admin = await this.getRepository.findOne({ where: { id } });
    return {
      status_code: 200,
      message: 'success',
      data: updated_admin,
    };
  };

  async deleteAdmin(id: number) {
    const data = await this.findOneById(id);
    try {
      await this.getRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(`Error on deleting user: ${error}`);
    }
    if (
      data.data.photo &&
      (await this.fileService.existFile(data.data.photo))
    ) {
      await this.fileService.deleteFile(data.data.photo);
    }
    return {
      status_code: 200,
      message: 'success',
      data: {},
    };
  }

  private async generateTokens(payload: object) {
    try {
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: config.ACCESS_TOKEN_KEY,
          expiresIn: config.ACCESS_TOKEN_TIME,
        }),
        this.jwtService.signAsync(payload, {
          secret: config.REFRESH_TOKEN_KEY,
          expiresIn: config.REFRESH_TOKEN_TIME,
        }),
      ]);
      return { access_token, refresh_token };
    } catch (error) {
      throw new BadRequestException(`Error on generate tokens: ${error}`);
    }
  };

  private async writeToCookie(refresh_token: string, res: Response) {
    try {
      res.cookie('refresh_token_admin', refresh_token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
    } catch (error) {
      throw new BadRequestException(`Error on write to cookie: ${error}`);
    }
  };

  
}
