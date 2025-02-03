import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn } from "typeorm";
import { EUserRole } from "../enums/user-role.enum";
import bcrypt from 'bcryptjs';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ unique: true, type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ default: false, type: 'boolean' })
    verified: boolean;

    @Column({ default: 'user', type: 'enum', enum: EUserRole })
    role: EUserRole;

    @CreateDateColumn()
    createdAt!: Date;

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}