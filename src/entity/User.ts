import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

export enum Role {
  ADMIN = "admin",
  DEALER = "dealer",
  CUSTOMER = "customer",
}

@Entity({ name: "users" })
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  @Unique(["email"])
  email: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "timestamp",
  })
  deletedAt: Date;
}
