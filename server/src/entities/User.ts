import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(()=> Int)
  @PrimaryGeneratedColumn()
  id!:number;

  @Field({description: 'username'})
  @Column({unique: true, comment: 'username'})
  username: string;

  @Field({description: 'user-email'})
  @Column({unique: true, comment: 'user-email'})
  email: string;

  @Column({comment: 'password'})
  password: string;

  @Field(()=> String, {description: 'creation-time'})
  @CreateDateColumn({comment: 'creaction-time'})
  createdAt: Date;

  @Field(()=> String, {description: 'update-date'})
  @UpdateDateColumn({comment: 'update-date'})
  updatedAt: Date;
}