export type RoomName = string;
export type TodoId = number;
export type UserName = string;
export type Text = string;
export type Checked = boolean;

export type Todo = {
  id: TodoId;
  userName: UserName;
  text: Text;
  checked: Checked;
}

export type PayloadJoined = {
  userName: UserName,
  roomName: RoomName
}

export type PayloadTodos = { 
  todos: Todo[];
}

export type FunctionJoinRoom = (joinInfo: PayloadJoined) => void;

declare global {
  interface Window {
    socket: SocketIOClient.Socket;
  }
}
