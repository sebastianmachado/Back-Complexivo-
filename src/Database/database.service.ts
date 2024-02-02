import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class DatabaseService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.HOST_DB,
      port: +process.env.PORT_DB,
      user: process.env.USERNAME_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.NAME_DB,
    });
  }

  //Se verifica si ya estan creado el usuario presidencia antes de insertar

  async usuariopresidenciaExists(): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT COUNT(*) FROM usuarios 
        WHERE id_usuarios = 1 
        OR nombres = 'Escuela' 
        OR apellidos = 'Escuela' 
        OR correo = 'escuela@hotmail.com';
      `;
      const result = await client.query(query);
      return result.rows[0].count > 0;
    } finally {
      client.release();
    }
  }
  //Se verifica si ya estan creados primeramente antes de insertar

  async estadoExistsActivo(): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = `
      SELECT COUNT(*) FROM estados WHERE nombre = 'Activo';
    `;
      const result = await client.query(query);
      return result.rows[0].count > 0;
    } finally {
      client.release();
    }
  }

  async estadoExistsInactivo(): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = `
      SELECT COUNT(*) FROM estados WHERE nombre = 'Inactivo';
    `;
      const result = await client.query(query);
      return result.rows[0].count > 0;
    } finally {
      client.release();
    }
  }

  async estadoExistsBloqueado(): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = `
      SELECT COUNT(*) FROM estados WHERE nombre = 'Bloqueado';
    `;
      const result = await client.query(query);
      return result.rows[0].count > 0;
    } finally {
      client.release();
    }
  }

  async roleExistsPresidencia(): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT COUNT(*) FROM roles WHERE nombre = 'Administracion';
      `;
      const result = await client.query(query);
      return result.rows[0].count > 0;
    } finally {
      client.release();
    }
  }

  async roleExistsProyectos(): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT COUNT(*) FROM roles WHERE nombre = 'Inventario';
      `;
      const result = await client.query(query);
      return result.rows[0].count > 0;
    } finally {
      client.release();
    }
  }

 

  //insercion de datos

  async insertIntoRoles() {
    const client = await this.pool.connect();
    try {
      // Verifica si ya existe estado 'Activo'
      if (!(await this.estadoExistsActivo())) {
        const queryestadoActivo = `
          INSERT INTO estados (id_estados, nombre, acronimo, descripcion)
          VALUES (1, 'Activo', 'EA', 'Estado activo del Usuario');
        `;
        await client.query(queryestadoActivo);
      }
      // Verifica si ya existe estado 'Inactivo'
      if (!(await this.estadoExistsInactivo())) {
        const queryestadoInactivo = `
          INSERT INTO estados (id_estados, nombre, acronimo, descripcion)
          VALUES (2, 'Inactivo', 'IA', 'Estado inactivo del Usuario');
        `;
        await client.query(queryestadoInactivo);
      }

      if (!(await this.estadoExistsBloqueado())) {
        const queryestadoBloqueado = `
          INSERT INTO estados (id_estados, nombre, acronimo, descripcion)
          VALUES (3, 'Bloqueado', 'EB', 'Estado bloqueado del Usuario');
        `;
        await client.query(queryestadoBloqueado);
      }
      // Verifica si ya existe 'Presidencia'
      if (!(await this.roleExistsPresidencia())) {
        const queryPresidencia = `
          INSERT INTO roles (id_roles, nombre, descripcion)
          VALUES (1, 'Administracion', 'Se administra el modulo de Administracion');
        `;
        await client.query(queryPresidencia);
      }
      // Verifica si ya existe 'Proyectos'
      if (!(await this.roleExistsProyectos())) {
        const queryProyectos = `
          INSERT INTO roles (id_roles, nombre, descripcion)
          VALUES (2, 'Inventario', 'Se administra el modulo de Inventario');
        `;
        await client.query(queryProyectos);
      }
      // Verifica si ya existe 'Secretaria'
      

      // Realiza la inserción de usuarios al final
      // Verifica si ya existe usuario 'Presidencia'
      const dbPassword = process.env.SUPER_USER_KEY;
      if (!(await this.usuariopresidenciaExists())) {
        const plainPassword = dbPassword;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const queryusuariopresidencia = `
          INSERT INTO usuarios (nombres, apellidos, clave, correo, identificacion, celular, id_roles, id_estado)
          VALUES ('Escuela', 'Escuela', $1, 'escuela@hotmail.com', '', '', 1, 1);
        `;

        await client.query(queryusuariopresidencia, [hashedPassword]);
      }
    } finally {
      client.release();
    }
  }
}
