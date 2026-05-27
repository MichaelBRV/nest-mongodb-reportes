import { Prop, Schema } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type RolesDocument = HydratedDocument<RolesSchema>;
@Schema({ versionKey: false })
export class RolesSchema {
  @Prop({ required: true })
    name: string

  @Prop({ required: true })
    description: string

  @Prop({ required: true })
    modules: [string]

  @Prop({ default: Date.now })
    _date: Date
}
