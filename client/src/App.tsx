import React, { FC, useReducer, useEffect } from 'react';
import JoinBlock from './components/JoinBlock';
import TodoApp from './components/TodoApp';
import { Grid, makeStyles, createStyles, Theme } from '@material-ui/core';
import reducer from './reducer';
import { FunctionJoinRoom, Todo } from './types';
import socket from './socket';
import api from './api';

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
    todos: []
  });
  console.log('----->todos', state.todos)
  const updateTodos = (todos: Todo[]) => {
    dispatch({
      type: 'UPDATE_TODOS',
      payload: { todos },
    });
  };

  const joinRoom: FunctionJoinRoom = async (joinInfo) => {
    dispatch({
      type: 'JOINED',
      payload: joinInfo,
    });

    socket.emit('ROOM:JOIN', {
      roomId: joinInfo.roomName,
      userName: joinInfo.userName
    });

    const { data } = await api.getRoom(joinInfo.roomName);

    updateTodos(data);
  }

  useEffect(() => {
    socket.on('ROOM:UPDATE_TODOS', updateTodos);
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
