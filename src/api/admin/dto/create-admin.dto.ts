import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { IsCustomEmail } from "src/common/decorators/is-email";


export class CreateAdminDto {
    @ApiProperty({
        type: String,
        description: 'Full name of admin',
        example: 'Doston Odilov',
    })
    @IsNotEmpty()
    @IsString()
    full_name: string;

    @ApiProperty({
        type: String,
        description: 'Email of admin',
        example: 'aliyev@gmail.com',
    })
    @IsNotEmpty()
    @IsCustomEmail()
    email: string;

    @ApiProperty({
        type: String,
        description: 'Password of admin',
        example: 'Admin123!',
    })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @ApiProperty({
        type: String,
        description: 'Phone number of admin',
        example: '+998901234567',
    })
    @IsNotEmpty()
    @IsPhoneNumber()
    phone_number: string;

    @ApiPropertyOptional({
        type: Boolean,
        description: 'Status of admin',
        example: false,
    })
    @IsOptional()
    is_active: boolean;

    @IsOptional()
    photo?: string
};
