import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, DeleteDateColumn } from 'typeorm';
// import { User } from 'src/api/users/entities/user.entity';

@Entity('clinics')
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  region: string;

  @Column({ type: 'boolean' , default: true})
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;
  
  @DeleteDateColumn()  
  deletedAt?: Date;

//   @OneToMany(() => User, user => user.clinic)
//   users: User[];
}
