import bodyParser from "body-parser";
import express from "express";
import socket from "socket.io";

import { RoomCtrl } from "../controllers/index";

const createRoutes = (app: express.Express, io: socket.Server) => {
  const RoomController = new RoomCtrl(io);

  app.use(bodyParser.json());

  app.get("/api/rooms/:id", RoomController.index);
  app.post('/api/rooms', RoomController.create);

};

export default createRoutes;
