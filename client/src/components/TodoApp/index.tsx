import React, {FC, useState, ChangeEvent, MouseEvent, KeyboardEvent, useEffect} from "react";
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
  ListItemText,
  Checkbox,
  IconButton,
  TextField,
  Typography
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
  users: {
    userName: UserName,
    roomName: RoomName,
  },
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
      width: '100%'
    }
  }),
);

const TodoApp: FC<Props> = (props) => {
  const classes = useStyles();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<Text>('');

  useEffect(() => {
    setTodos([...props.todos]);
  }, []);
  console.log('----->props.todos', props.todos)
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (text) {
        const newTodos = [...todos];

        // newTodos.push({
        //   text,
        //   id: newTodos.length,
        //   userName: props.userName,
        //   checked: false
        // });

        socket.emit('ROOM:NEW_TODO', {
          text,
          userName: props.userName,
          roomId: props.roomName
        });

        setTodos([...newTodos]);
        setText('');
      }
    }
  }

  const handleToggle = (todoId: TodoId) => () => {
    const newTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          checked: !todo.checked
        }
      }

      return todo;
    });

    setTodos([...newTodos]);
  }

  const handleDelete = (todoId: TodoId) => () => {
    const newTodos = todos.filter((todo) => {
      return todo.id === todoId ? false : true;
    });

    setTodos([...newTodos]);
  }

  return (
    <Grid item xs={12} sm={10} md={8} lg={6}>
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
            const labelId = `checkbox-list-label-${todo.id}`;

            return (
              <ListItem
                key={todo.id}
                role={undefined}
                dense
                button
                onClick={handleToggle(todo.id)}
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
                  <IconButton edge="end" onClick={handleDelete(todo.id)}>
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
