import controller from './controller';
import {
  DataAddUserInRoom
} from './types';
import { RoomName } from '../types';

const api = {
  getRoom(roomName: RoomName) {
    return controller.get(`api/rooms/${roomName}`)
      .then((response) => {
        return response;
      });
  },
  addUserInRoom(data: DataAddUserInRoom) {
    return controller.post('api/rooms', data)
      .then((response) => {
        return response;
      });
  }
};

export default api;
