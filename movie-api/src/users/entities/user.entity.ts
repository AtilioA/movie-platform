import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @MinLength(8)
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Hash password before persisting to the database
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
