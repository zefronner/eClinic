import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appointment_id: number;

  @Column()
  diagnosis: string;

  @Column()
  treatment: string;

  @Column()
  note: string;

  @Column()
  create_by: number;

  @Column()
  createdAt: Date;
}
