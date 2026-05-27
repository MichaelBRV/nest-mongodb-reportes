import { Prop, Schema } from '@nestjs/mongoose'
import { StatusRC } from '../src/libs/enums'
import { Collections } from '../src/libs/utils'
import { Types } from 'mongoose'
import { ObjectId } from '../src/config'


@Schema({ versionKey: false, _id: false })
class Description {
  @Prop({ required: false, default: Date.now })
    date: Date
  @Prop({ required: false, default: '' })
    observation: string
}

@Schema({ versionKey: false })
export class UsesRcSchema {
  @Prop({ enum: StatusRC.getEnum(), default: 1 })
    status: number

  @Prop({ required: true, default: {}, type: Object })
    data: { nui: string, codigoDactilar: string, consumer: string }

  @Prop({ default: Date.now })
    _date: Date

  @Prop({ required: true })
    type: string

  @Prop({ required: false, type: Description })
    description : Description

  @Prop({ default: true })
    dev: boolean

  @Prop({ type: ObjectId,  ref: Collections.PROJECTS, required: false })
    project: Types.ObjectId

   @Prop({
    type: Types.ObjectId,
    ref: Collections.USES_SERVICES,
    required: false
  })
  usesServices: Types.ObjectId

  @Prop({ type: ObjectId, ref: Collections.INFORMATION_USERS, required: false })
    informationUser: Types.ObjectId
}



