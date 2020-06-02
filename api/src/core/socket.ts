import socket from 'socket.io';
import http from 'http';
import RoomsModel, {IRooms} from "../models/Rooms";
import {Types} from "mongoose";
import ObjectId = module

export default (http: http.Server) => {
  const io = socket(http);

  io.on('connection', function (socket) {
    socket.on('ROOM:JOIN', async ({roomId, userName}: { roomId: string, userName: string }) => {
      socket.join(roomId);

      const candidate = await RoomsModel.findOne({
        roomId
      });
      let users: string[] = [];

      if (candidate) {

        const sortSocketUser = [...candidate.users, {id: socket.id, userName}].filter(item => !!item.id)
        let updated: object = {users: sortSocketUser}

        try {
          await RoomsModel.findOneAndUpdate(
            {
              roomId
            },
            {
              $set: updated
            },
            {new: true},
            (err, doc: IRooms | null) => {
              if (err || !doc) {
                socket.to(candidate.roomId).broadcast.emit('error', err);
              } else {
                users = doc.users.map(item => item.userName)

              }
            });
        } catch (e) {
          socket.to(candidate.roomId).broadcast.emit('error', e);
        }
      }
      socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
    });

    socket.on('ROOM:NEW_TODO', async ({roomId, userName, text, checked}: { roomId: string, userName: string, text: string, checked: boolean }) => {

      const obj: { userName: string, text: string, checked: boolean } = {
        userName,
        text,
        checked
      };
      const candidate = await RoomsModel.findOne({
        roomId
      });

      if (candidate) {

        const sortSocketTodos = [obj, ...candidate.todos.reverse()].slice(0, 20).reverse()
        let updated: object = {
          todos: sortSocketTodos
        }

        try {
          await RoomsModel.findOneAndUpdate(
            {
              roomId
            },
            {
              $set: updated
            },
            {new: true},
            (err, doc: IRooms | null) => {
              if (err || !doc) {
                socket.to(candidate.roomId).broadcast.emit('error', err);
              } else {
                socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj);
              }
            });
        } catch (e) {
          socket.to(candidate.roomId).broadcast.emit('error', e);
        }
      }
    });

    socket.on('ROOM:UPDATE_TODO', async ({roomId, todo}: {roomId:string, todo: { id: ObjectId }}) => {

      const candidate = await RoomsModel.findOne({
        "todos.id": todo.id
      });

      if (candidate) {
        const updated = candidate.todos.map(item => todo.id === item.id ? todo : item)
        try {
          await RoomsModel.findOneAndUpdate(
            {
              roomId
            },
            {
              $set: {updated}
            },
            {new: true},
            (err, doc: IRooms | null) => {
              if (err || !doc) {
                socket.to(candidate.roomId).broadcast.emit('error', err);
              } else {
                socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', doc);
              }
            });
        } catch (e) {
          socket.to(candidate.roomId).broadcast.emit('error', e);
        }
      }
    });

    socket.on('ROOM:DELETE_TODO', async ({roomId, todo}: {roomId:string, todo: { id: ObjectId }}) => {

      const candidate = await RoomsModel.findOne({
        "todos.id": todo.id
      });

      if (candidate) {
        const updated = candidate.todos.map(item => todo.id === item.id ? null : item)
        try {
          await RoomsModel.findOneAndUpdate(
            {
              roomId
            },
            {
              $set: {updated}
            },
            {new: true},
            (err, doc: IRooms | null) => {
              if (err || !doc) {
                socket.to(candidate.roomId).broadcast.emit('error', err);
              } else {
                socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', doc);
              }
            });
        } catch (e) {
          socket.to(candidate.roomId).broadcast.emit('error', e);
        }
      }
    });

    socket.on('disconnect', async () => {

      let users: string[] = [];
      const candidate = await RoomsModel.findOne({'users.id': socket.id})

      if (candidate) {

        const sortSocketUser = candidate.users.filter(item => item.id !== socket.id)
        let updated: object = {users: sortSocketUser}

        try {
          await RoomsModel.findOneAndUpdate(
            {'users.id': socket.id},
            {
              $set: updated
            },
            {new: true},
            (err, doc: IRooms | null) => {
              if (err || !doc) {
                socket.to(candidate.roomId).broadcast.emit('error', err);
              } else {
                users = doc.users.map(item => item.userName)

              }
            });
        } catch (e) {
          socket.to(candidate.roomId).broadcast.emit('error', e);
        }
        socket.to(candidate.roomId).broadcast.emit('ROOM:SET_USERS', users);
      }

    });

    console.log('user connected', socket.id);
  });

  return io;
};
