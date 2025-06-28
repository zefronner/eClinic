import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../../common/enums'; 

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PAYMENT_METHOD,
    default: PAYMENT_METHOD.CASH,
  })
  method: PAYMENT_METHOD;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PENDING,
  })
  status: PAYMENT_STATUS;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
