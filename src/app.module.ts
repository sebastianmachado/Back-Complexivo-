import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSourceconfig } from './config/data.source';
import { UsuariosModule } from './usuarios/usuarios.module';

import { RolesModule } from './roles/roles.module';
import { EstadosModule } from './estados/estados.module';
import { DatabaseService } from './Database/database.service';
import { DatabaseModule } from './Database/database.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ProyectoModule } from './proyecto/proyecto.module';
import { PresidenciaModule } from './presidencia/presidencia.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...DataSourceconfig,
      autoLoadEntities: true,
    }),


    UsuariosModule,

    RolesModule,
    EstadosModule,
    DatabaseModule,
    ProyectoModule,
    PresidenciaModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
