import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ versionKey: false, _id: false })
export class CiudadanoSchema {
  @Prop({ required: true })
    NUI: string
  @Prop()
    CODIGODACTILAR: string

  @Prop()
    NOMBRE: string

  @Prop()
    APELLIDOS: string

  @Prop()
    NOMBRES: string

  @Prop()
    FECHANACIMIENTO: string

  @Prop()
    FECHACEDULACION: string

  @Prop()
    NACIONALIDAD: string

  @Prop()
    CONDICIONCEDULADO: string

  @Prop()
    NOMBREPADRE: string

  @Prop()
    NOMBREMADRE:string

  @Prop()
    INSTRUCCION: string

  @Prop()
    PROFESION: string


  @Prop({ type: Object })
    DOMICILIO: {
    DOMICILIO: string,
    CALLE: string,
    NUMEROCASA: string
  }

  @Prop()
    SEXO:string

  @Prop({ type: Object })
    NACIMIENTO: { LUGARNACIMIENTO: string; }


  @Prop( { type: Object })
    DEFUNCION: {
    FECHAFALLECIMIENTO: string;
  }

  @Prop( { type: Object })
    CONYUGE : {
    CONYUGE: string,
    FECHAMATRIMONIO: string
  }

  @Prop({ type: String })
    FOTO: string

  @Prop()
    FIRMA: string
}

@Schema({ versionKey: false, _id: false })
export class UserDataTestSchema {
  @Prop()
    codigo: string

  @Prop()
    mensaje: string

  @Prop({ type: CiudadanoSchema })
    ciudadano: CiudadanoSchema
}
