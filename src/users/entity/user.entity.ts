import { Exclude, Expose } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export const USESR_DETAIL = 'user_detail';
export const USESR_GROUP = 'user_group';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @Expose({ groups: [USESR_DETAIL, USESR_GROUP] })
  id: number;
  
  @Column()
  @Expose({ groups: [USESR_DETAIL, USESR_GROUP] })
  name: string;
  
  @Column()
  @Expose({ groups: [USESR_DETAIL] })
  email: string;
  
  @Column()
  @Exclude()
  password: string;
}
