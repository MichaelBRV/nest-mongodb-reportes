import { Prop, Schema } from '@nestjs/mongoose'
import { ObjectId } from '../src/config'
import { Collections } from '../src/libs/utils'
import { Types } from 'mongoose'

@Schema()
export class ExecutiveSchema {
  @Prop({ default: Date.now })
    _date: Date

  @Prop({ required: true })
    names: string

  @Prop({ required: true })
    password: string

  @Prop({ required: true })
    username: string

  @Prop({ required: true })
    email: string

  @Prop({ required: true })
    phone: string

  @Prop({ default: false })
    administrator: boolean

  @Prop({ default: true })
    active: boolean

  @Prop({ type: ObjectId, ref: Collections.ROLES })
    role: Types.ObjectId

  @Prop({ type: ObjectId, ref: Collections.PROJECTS })
    project: Types.ObjectId
}
