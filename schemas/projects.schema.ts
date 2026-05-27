import { Prop, Schema } from '@nestjs/mongoose'
@Schema({ versionKey: false })
export class ProjectsSchema {

  @Prop({ required: true })
    name: string

  @Prop({ required: true })
    alias: string

  @Prop({ required: false })
    logo: string

  @Prop({ required: false })
    color: string

@Prop({ required: false })
  url: string

  @Prop({ default: Date.now })
    _date: Date
}
