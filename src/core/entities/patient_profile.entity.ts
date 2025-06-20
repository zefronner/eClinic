import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity('patient_profile')
export class PatientProfileEntity extends BaseEntity{
    @Column({ type: 'integer', name: 'user_id'})
    user_id: number;

    @Column({ type: 'varchar', name: 'blood_group'})
    blood_group: string;

    @Column({ type: 'varchar', name: 'allergies'})
    allergies: string;

    @Column({ type: 'varchar', name: 'chronic_diseases'})
    chronic_diseases: string;

    @Column({ type: 'float', name: 'weight' })
    weight: number;

    @Column({ type: 'float', name: 'height'})
    height: number;

    
}
