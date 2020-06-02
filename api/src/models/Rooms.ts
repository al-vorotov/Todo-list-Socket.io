import mongoose, {
  Schema,
  Document,
  Types
} from 'mongoose';

export interface IRooms extends Document {
  roomId: string,
  users: [{
    id: string,
    userName: string
  }];
  todos: [{
    userName: string,
    text: string,
    _id: Types.ObjectId,
    checked: boolean
  }]
}

const RoomsSchema = new Schema(
  {
    roomId: {
      type: String,
    },
    users: {
      type: [{
        id: String,
        userName: String
      }]
    },
    todos: {
      type: [{
        userName: String,
        text: String,
        checked: Boolean
      }]
    },
  },
  {
    timestamps: true,
    usePushEach: true,
  },
);

const RoomsModel = mongoose.model<IRooms>('Todos', RoomsSchema);

export default RoomsModel;
