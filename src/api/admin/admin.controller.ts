import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus, Res, BadRequestException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/infrastructure/lib/pipe/image.validation.pipe';
import { SigninAdminDto } from './dto/signin-admin.dto';
import { ConfirmOTPDto } from './dto/confirm-otp.dto';
import { Response } from 'express';
import { CookieGetter } from 'src/common/decorators/cookie-getter.decorator';
import { RoleAdmin } from 'src/common/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { SelfGuard } from 'src/common/guard/self.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'Create super admin (one time API)'
  })
  @ApiConsumes('multipart:form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: {
          type: 'string',
          example: 'Ali Valiyev'
        },
        phone_number: {
          type: 'string',
          example: '+998098765432'
        },
        email: {
          type: 'string',
          example: 'aliyev@gmail.com'
        },
        password: {
          type: 'string',
          example: 'Admin123!',
        },
        photo: {
          type: 'string',
          format: 'binary',
        },
        is_active: {
          type: 'boolean',
          example: false,
        },
      },
      required: ['full_name', 'phone_number', 'email', 'password']
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Super admin created',
    schema: {
      example: {
        status_code: 201,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed creating super admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on creating super admin',
      },
    },
  })
  @ApiOperation({
    summary: 'Create admin',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: {
          type: 'string',
          example: 'Doston Odilov',
        },
        email: {
          type: 'string',
          example: 'aliyev@gmail.com',
        },
        password: {
          type: 'string',
          example: 'Admin123!',
        },
        phone_number: {
          type: 'string',
          example: '+998901234567',
        },
        photo: {
          type: 'string',
          format: 'binary',
        },
        is_active: {
          type: 'boolean',
          example: false,
        },
      },
      required: ['full_name', 'phone_number', 'email', 'password'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin created successfully',
    schema: {
      example: {
        status_code: 201,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed creating admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on creating admin',
      },
    },
  })
  @Post('super')
  @UseInterceptors(FileInterceptor('photo'))
  async createSuperAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile(new ImageValidationPipe())
    photo?: Express.Multer.File | undefined | any
  ) {
    const admins = await this.adminService.findAll();
    if (admins.data.length) {
      throw new HttpException('Endpoint no longer active', HttpStatus.GONE);
    };
    return this.adminService.createSuperAdmin(createAdminDto, photo)
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('superadmin')
  @UseInterceptors(FileInterceptor('photo'))
  @Post()
  @ApiBearerAuth()
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile(new ImageValidationPipe())
    photo?: Express.Multer.File | undefined | any,
  ) {
    return this.adminService.createAdmin(createAdminDto, photo);
  }

  @ApiOperation({
    summary: 'Signin admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin signed in successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: '+998901234567',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed signing admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Invalid username or password',
      },
    },
  })
  @Post('signin')
  async signin(@Body() signinDto: SigninAdminDto) {
    return this.adminService.signin(signinDto);
  };

  @ApiOperation({
    summary: 'Confirm OTP on signin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Confirm OTP successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6IjRkMGJ',
          access_token_expire: '24h',
          refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6IjRkMGJ',
          refresh_token_expire: '15d',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed verifying OTP on email',
    schema: {
      example: {
        status_code: 400,
        message: 'OTP expired or invalid email',
      },
    },
  })
  @Post('confirm-signin')
  async confirmOTPSignin(
    @Body() confirmOTPDto: ConfirmOTPDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.confirmSignInAdmin(confirmOTPDto, res);
  };

  @ApiOperation({ summary: 'New access token for admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get new access token success',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6IjRkMGJ',
          expire: '24h',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Fail new access token',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on refresh token',
      },
    },
  })
  @Post('refresh-token')
  refreshToken(@CookieGetter('refresh_token_admin') refresh_token: string) {
    return this.adminService.refreshToken(refresh_token);
  };

  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin logged out success',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Fail on logging out admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on logout',
      },
    },
  })
  @UseGuards(JwtGuard)
  @Post('logout')
  @ApiBearerAuth()
  logout(
    @CookieGetter('refresh_token_admin') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refresh_token, res);
  }

  @ApiOperation({
    summary: 'Get all admins',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All admins fetched successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: [
          {
            id: '9',
            created_at: '1730288822952',
            updated_at: '1730288797974',
            full_name: 'John Doe',
            email: 'aliyev@gmail.com',
            phone_number: '+998901234567',
            password: 'StrongPass!1',
            photo: '',
            is_active: true,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed fetching admins',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on fetching admins',
      },
    },
  })
  @UseGuards(JwtGuard, SelfGuard)
  @Roles('superadmin')
  @Get()
  @ApiBearerAuth()
  async getAllAdmins() {
    try {
      return this.adminService.findAll({
        where: { role: RoleAdmin.ADMIN },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException(`Error on fetching admins: ${error}`)
    }
  }

  @ApiOperation({
    summary: 'Get admin by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the admin',
    type: String,
    example: '7',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin fetched by id successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: '9',
          created_at: '1730288822952',
          updated_at: '1730288797974',
          email: 'aliyev@gmail.com',
          full_name: 'John Doe',
          phone_number: '+998901234567',
          password: 'StrongPass!1',
          photo: '',
          is_active: false,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed fetching admin by ID',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on fetching admin by ID',
      },
    },
  })
  @UseGuards(JwtGuard, SelfGuard)
  @Get(':id')
  @ApiBearerAuth()
  async getAdminById(@Param('id') id: string) {
    try {
      return this.adminService.findOneById(+id, {
        where: { role: RoleAdmin.ADMIN }
      })
    } catch (error) {
      throw new BadRequestException(`Error on fetching admin: ${error}`)
    };
  };

  @ApiOperation({
    summary: 'Edit profile of admin',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the admin',
    type: String,
    example: '6',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: {
          type: 'string',
          example: 'Doston Odilov',
        },
        phone_number: {
          type: 'string',
          example: '+998901234567',
        },
        email: {
          type: 'string',
          example: 'aliyev@gmail.com',
        },
        password: {
          type: 'string',
          example: 'Admin123!',
        },
        photo: {
          type: 'string',
          format: 'binary',
        },
        is_active: {
          type: 'boolean',
          example: false,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile of admin edited',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {
          id: '3',
          created_at: '1730288822952',
          updated_at: '1730288797974',
          full_name: 'John Doe',
          email: 'aliyev@gmail.com',
          phone_number: '+998901234567',
          password: 'StrongPass!1',
          photo: '',
          is_active: false,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed edit profile of admin',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on update profile of admin',
      },
    },
  })
  @UseGuards(JwtGuard, SelfGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('photo'))
  async editProfile(
    @Param('id', ParseIntPipe) id: string, 
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFile(new ImageValidationPipe())
    photo? : Express.Multer.File | undefined | any
  ) {
    return this.adminService.editProfile(+id, updateAdminDto, photo);
  }

  @ApiOperation({
    summary: 'Delete admin by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of admin',
    type: String,
    example: '9',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin by ID deleted successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed delete admin by ID',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on deleting admin by ID',
      },
    },
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  @ApiBearerAuth()
  async deleteAdmin(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.adminService.deleteAdmin(+id);
    } catch (error) {
      throw new BadRequestException(`Error on deleting admin: ${error}`)
    }
  };
};
