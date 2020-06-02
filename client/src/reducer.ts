import {
  UserName,
  RoomName,
  Todo,
  PayloadJoined,
  PayloadTodos,
  PayloadUsers
} from "./types";

type State = {
  joined: boolean;
  roomName: RoomName;
  userName: UserName;
  users: UserName[];
  todos: Todo[];
}

type Action =
  | {
    type: 'JOINED';
    payload: PayloadJoined;
  }
  | {
    type: 'NEW_TODO';
    payload: PayloadTodos;
  }
  | {
    type: 'UPDATE_TODOS';
    payload: PayloadTodos;
  }
  | {
    type: 'UPDATE_USERS';
    payload: PayloadUsers;
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

    case 'NEW_TODO':
      return {
        ...state,
        todos: action.payload.todos
      };

    case 'UPDATE_TODOS':
      return {
        ...state,
        todos: action.payload.todos
      };

    case 'UPDATE_USERS':
      return {
        ...state,
        users: action.payload.users
      };

    default:
      return state;
  }
};
