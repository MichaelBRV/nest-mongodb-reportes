import { Prop, Schema } from '@nestjs/mongoose'
import { ObjectId } from '../src/config'
import { Collections } from '../src/libs/utils'
import { Types } from 'mongoose'

@Schema()
export class ProjectsAssignmentsSchema {
  @Prop({ default: Date.now })
    _date: Date
  @Prop({ type: ObjectId, ref: Collections.EXECUTIVES })
    executive: Types.ObjectId

  @Prop({ type: ObjectId, ref: Collections.PROJECTS })
    project: Types.ObjectId

  @Prop({ default: 0 })
    count: number
}
