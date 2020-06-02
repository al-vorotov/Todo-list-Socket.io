import React, {
  FC,
  useState,
  ChangeEvent,
  KeyboardEvent
} from "react";
import {
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core/styles';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  TextField,
  Typography,
  Paper
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  Todo,
  Text,
  TodoId,
  UserName,
  RoomName
} from "../../types";
import socket from "../../socket";

type Props = {
  userName: UserName,
  roomName: RoomName,
  users: UserName[],
  todos: Todo[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
    },
    todoText: {
      'white-space': 'nowrap',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      marginLeft: '3px'
    },
    textField: {
      marginTop: '50px',
      width: '100%'
    },
    userList: {
      zIndex: 1000,
      position: 'fixed',
      top: '5px',
      right: '5px',
      padding: '10px',
      width: '100px',
    },
    userListBlock: {
      borderTop: '1px solid #A8A8A8',
      marginTop: '5px',
      padding: '5px'
    }
  }),
);

const TodoApp: FC<Props> = ({roomName, userName, users, todos}) => {

  const classes = useStyles();

  const [text, setText] = useState<Text>('');

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {

    if (event.key === 'Enter') {
      if (text) {
        socket.emit('ROOM:NEW_TODO', {
          text,
          userName,
          roomId: roomName,
          checked: false
        });

        setText('');
      }
    }
  }

  const handleToggle = (todoId: TodoId) => () => {

    todos.forEach((todo) => {
      if (todo._id === todoId) {
        const updatedTodo = {
          ...todo,
          checked: !todo.checked
        };

        socket.emit('ROOM:UPDATE_TODO', {
          todo: updatedTodo,
          roomId: roomName
        });
      }
    });
  }

  const handleDelete = (todoId: TodoId) => () => {

    todos.forEach((todo) => {
      if (todo._id === todoId) {
        socket.emit('ROOM:DELETE_TODO', {
          todo,
          roomId: roomName
        });
      }
    });
  }

  return (
    <Grid item xs={12} sm={10} md={8} lg={6}>
      <Paper className={classes.userList}>
        <Typography
          component="span"
          variant="body2"
          color="textPrimary"
        >
          Users:
        </Typography>
        <div className={classes.userListBlock}>
          {
            users.map((user) => {
              return <div key={user}>{user}</div>;
            })
          }
        </div>
      </Paper>

      <TextField
        id="standard-basic"
        label="Todo"
        value={text}
        onChange={handleTextChange}
        onKeyPress={handleKeyPress}
        autoFocus
        className={classes.textField}
      />
      <List className={classes.root}>
        {
          todos.map((todo) => {
            const labelId = `checkbox-list-label-${todo._id}`;

            return (
              <ListItem
                key={todo._id}
                role={undefined}
                dense
                button
                onClick={handleToggle(todo._id)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={todo.checked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{'aria-labelledby': labelId}}
                  />
                </ListItemIcon>

                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  {todo.userName}
                </Typography>

                <div className={classes.todoText}>
                  {'- ' + todo.text}
                </div>

                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={handleDelete(todo._id)}>
                    <DeleteIcon fontSize="small"/>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })
        }
      </List>
    </Grid>
  );
}

export default TodoApp;
