import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ versionKey: false })
export class InformationUsersSchema {
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

  @Prop({ type: Object })
    NACIMIENTO: { LUGARNACIMIENTO: string; }

  @Prop({ type: Object })
    CONYUGE: {
    FECHAMATRIMONIO: string;
  }

  @Prop( { type: Object })
    DEFUNCION: {
    FECHAFALLECIMIENTO: string;
  }

  @Prop({ type: String })
    FOTO: string

  @Prop()
    FIRMA: string
}