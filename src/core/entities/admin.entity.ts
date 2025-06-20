import { BaseEntity } from "src/common/database/BaseEntity";
import { RoleAdmin } from "src/common/enum";
import { Column, Entity } from "typeorm";

@Entity('admin')
export class AdminEntity extends BaseEntity{
    @Column({ type: 'varchar', name: 'full_name' })
    full_name: string;

    @Column({ type: 'varchar', unique: true, name: 'email' })
    email: string;

    @Column({ type: 'varchar', name: 'password' })
    password: string

    @Column({
      type: 'varchar',
      name: 'phone_number',
      unique: true,
    })
    phone_number: string;

    @Column({ type: 'enum', enum: RoleAdmin, default: RoleAdmin.ADMIN })
    role: string;

    @Column({ type: 'varchar', name: 'photo', nullable: true })
    photo?: string
}
