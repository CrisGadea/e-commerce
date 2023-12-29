import { IsDate, IsEmail } from 'class-validator';
import { format } from 'date-fns';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuarios' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Column()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  /* @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; */
  @Column({ type: 'varchar', length: 19 }) // Usar varchar de longitud suficiente para YYYY-MM-DD
  @IsDate() // Asegurar que sea un objeto Date
  createdAt: string;

  @BeforeInsert() // Método que se ejecutará antes de insertar un registro
  updateTimestamp() {
    this.createdAt = format(new Date(), 'dd-MM-yyyy HH:mm:ss'); // Formatear la fecha al momento de creación
  }
}
