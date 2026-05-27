import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
// @ts-ignore
import mongooseSmartQuery from 'mongoose-smart-query'

@Schema()
export class UserDocs {
  @Prop({ default: Date.now })
    _date: Date

  @Prop({ required: true })
    password: string

  @Prop({ required: true })
    username: string

  @Prop({ required: false, default: true })
    active: boolean

  @Prop({ type: Array<String>, default: [] })
    modules: Array<string>
}

export const UserDocsSchema =
    SchemaFactory.createForClass(UserDocs)

export type UserDocsDocument = HydratedDocument<UserDocs>

UserDocsSchema.plugin(mongooseSmartQuery, {
  defaultFields: '_id username modules',
  defaultSort: '-_date',
  fieldsForDefaultQuery: '',
})

