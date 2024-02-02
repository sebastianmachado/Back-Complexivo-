
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'administracion' })
export class Presidencia {
  @PrimaryGeneratedColumn()
  id_presidencia: number;

  @Column({
    name: 'nombre_usuario',
    type: 'varchar',
    length: 100,
    comment: 'Se registrará el nombre de usuario',
  })
  nombre_usuario: string;

  @Column({
    name: 'correo_electronico',
    type: 'varchar',
    length: 100,
    comment: 'Se registrará el correo',
  })
  correo_electronico: string;

  @Column({
    name: 'contrasenia',
    type: 'varchar',
    length: 100,
    comment: 'Se registrará la contraseña',
  })
  contrasenia: string;

  @Column({
    name: 'departamento',
    type: 'varchar',
    length: 100,
    comment: 'Se registrará el departamento',
  })
  departamento: string;

  @Column({
    name: 'estado',
    type: 'bool',
    comment: 'Se registrará el estado',
  })
  estado: boolean;

 
}
