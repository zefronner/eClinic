import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @Column()
  appointment_time: Date;

  @Column()
  status: string;

  @Column()
  reason: string;

  @Column()
  createdAt: Date;
}
