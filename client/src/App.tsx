import React, {
  FC,
  useReducer,
  useEffect
} from 'react';

import {
  Grid,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core';

import JoinBlock from './components/JoinBlock';
import TodoApp from './components/TodoApp';
import reducer from './reducer';
import socket from './socket';
import api from './api';

import {
  FunctionJoinRoom,
  Todo,
  UserName
} from './types';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'center'
    }
  }),
);

const App: FC = () => {
  const classes = useStyles();

  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomName: '',
    userName: '',
    users: [],
    todos: []
  });

  const addTodo = (data: any) => {

    dispatch({
      type: 'NEW_TODO',
      payload: {todos: data},
    });
  };

  const updateTodos = (todos: Todo[]) => {

    dispatch({
      type: 'UPDATE_TODOS',
      payload: {todos},
    });
  };

  const updateRooms = (users: UserName[], todos: Todo[]) => {

    dispatch({
      type: 'UPDATE_USERS',
      payload: {users},
    });
    dispatch({
      type: 'UPDATE_TODOS',
      payload: {todos},
    });
  }

  const joinRoom: FunctionJoinRoom = async (joinInfo) => {

    dispatch({
      type: 'JOINED',
      payload: joinInfo,
    });

    socket.emit('ROOM:JOIN', {
      roomId: joinInfo.roomName,
      userName: joinInfo.userName
    });

    const {data} = await api.getRoom(joinInfo.roomName);

    updateTodos(data.todos);
    updateRooms(data.users, data.todos);
  }

  useEffect(() => {

    socket.on('ROOM:SET_USERS', updateRooms);
    socket.on('ROOM:ALL_TODOS', updateTodos);
    socket.on('ROOM:NEW_TODO', addTodo);
  }, []);

  window.socket = socket;

  return (
    <Grid container spacing={3} className={classes.root}>
      {
        !state.joined
          ? <JoinBlock onJoinRoom={joinRoom}/>
          : <TodoApp {...state} />
      }
    </Grid>
  );
}

export default App;
