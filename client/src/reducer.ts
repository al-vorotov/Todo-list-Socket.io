
import {
  UserName,
  RoomName,
  Todo,
  PayloadJoined,
  PayloadTodos
} from "./types";

type State = {
  joined: boolean;
  roomName: RoomName;
  userName: UserName;
  todos: Todo[];
}

type Action =
  | {
    type: 'JOINED';
    payload: PayloadJoined;
  }
  | {
    type: 'UPDATE_TODOS';
    payload: PayloadTodos;
  }

export default (state: State, action: Action): State => {
  switch (action.type) {
    case 'JOINED':
      return {
        ...state,
        joined: true,
        userName: action.payload.userName,
        roomName: action.payload.roomName,
      };

    case 'UPDATE_TODOS':
      return {
        ...state,
        todos: action.payload.todos
      };

    default:
      return state;
  }
};
