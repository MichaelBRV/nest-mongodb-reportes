import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectId } from '../src/config'
import { Collections } from '../src/libs/utils'
import { HydratedDocument, Types } from 'mongoose'
// @ts-ignore
import mongooseSmartQuery from 'mongoose-smart-query'

@Schema()
export class UserProjects {
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

  @Prop({ required: false, default: true })
    active: boolean

  @Prop({ type: ObjectId, ref: Collections.PROJECTS })
    project: Types.ObjectId
}

export const UserProjectsSchema =
    SchemaFactory.createForClass(UserProjects)

export type UserProjectsDocument = HydratedDocument<UserProjects>

UserProjectsSchema.plugin(mongooseSmartQuery, {
  defaultFields: '_id user project',
  defaultSort: '-_date',
  fieldsForDefaultQuery: '',
})

