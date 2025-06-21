import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
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

  @Column({ type: 'varchar' })
  is_active: string;

  @CreateDateColumn()
  createdAt: Date;

//   @OneToMany(() => User, user => user.clinic)
//   users: User[];
}
