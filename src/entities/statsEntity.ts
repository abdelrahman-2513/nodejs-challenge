import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./userEntity";

@Entity()
export class Stats {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @Column({ default: 0 })
    totalLogins: number;

    @UpdateDateColumn()
    lastLogin: Date;

    @CreateDateColumn()
    createdAt: Date;
}