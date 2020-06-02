import express from 'express';
import socket from 'socket.io';

import RoomsModel, {IRooms} from '../models/Rooms';

class RoomController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }

  index = async (req: express.Request, res: express.Response) => {
    const {id: roomId} = req.params;
    const candidate = await RoomsModel.findOne({
      roomId
    });
    if (candidate) {
      const users = candidate.users.map(item => item.userName)
      const obj = {
        users,
        todos: candidate.todos,
      }
      res.json(obj);
    } else {
      const obj = {
        roomId,
        users: [],
        todos: [],
      }
      res.json(obj);
    }
  };

  create = async (req: express.Request, res: express.Response) => {
    const {roomId, userName} = req.body;

    const candidate = await RoomsModel.findOne({
      roomId
    });

    if (candidate) {
      let updated: object = {users: [...candidate.users, {userName}]}
      try {
        await RoomsModel.findOneAndUpdate(
          {
            roomId,
          },
          {
            $set: updated
          },
          {new: true},
          (err, doc: IRooms | null) => {
            if (err || !doc) {
              res.status(500).json({
                massage: err
              })
            } else {
              res.status(201).json({
                doc
              })
            }
          });
      } catch (e) {
        res.status(500).json({
          massage: e
        })
      }
      res.status(201).json({
        candidate
      })
    } else {

      let newRooms = new RoomsModel({
        roomId,
        users: [{
          userName
        }],
        todos: [],
      });
      try {
        await newRooms.save();
        res.status(201).json({
          newRooms
        })
      } catch (e) {
        res.status(500).json({
          massage: e
        })
      }
    }
  };
}

export default RoomController;
