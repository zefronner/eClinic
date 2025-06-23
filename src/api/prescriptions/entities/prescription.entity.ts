import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MedicalRecord } from 'src/api/medical_records/entities/medical_record.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  record_id: number;

  @Column()
  medication: string;

  @Column()
  dosage: string;

  @Column()
  instructions: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => MedicalRecord)
  @JoinColumn({ name: 'record_id' })
  record: MedicalRecord;
}
