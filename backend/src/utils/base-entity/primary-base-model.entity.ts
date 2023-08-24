import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PrimaryBaseModel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
}
