import React, {FC, useState} from 'react';

import {
  RoomName,
  UserName,
  FunctionJoinRoom
} from '../../types';
import {
  Button,
  TextField,
  makeStyles,
  Theme,
  createStyles,
  Grid
} from '@material-ui/core';
import api from '../../api';

type Props = {
  onJoinRoom: FunctionJoinRoom;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    joinBlock: {
      margin: '10px 0',
      width: '300px'
    },
    textField: {
      width: '100%',
      marginBottom: '10px'
    },
    button: {
      width: '100%'
    }
  }),
);

const JoinBlock: FC<Props> = ({onJoinRoom}) => {
  const classes = useStyles();
  const [roomName, setRoomName] = useState<RoomName>('');
  const [userName, setUserName] = useState<UserName>('');
  const [isLoading, setLoading] = useState(false);

  const handleClick = async () => {
    const room = roomName.trim();
    const user = userName.trim();

    if (!room || !user) {
      return alert('Wrong data');
    }

    setLoading(true);
    await api.addUserInRoom({
      userName,
      roomId: roomName
    });
    onJoinRoom({ roomName, userName });
  };

  return (
    <Grid item xs={3} className={classes.joinBlock}>
      <TextField
        id="outlined-basic"
        className={classes.textField}
        label="Room Name"
        variant="outlined"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        size="small"
      />
      <TextField
        id="outlined-basic"
        className={classes.textField}
        label="Your Name"
        variant="outlined"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        size="small"
      />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        disabled={isLoading}
        onClick={handleClick}
      >
      {isLoading ? 'Entry...' : 'Join'}
      </Button>
    </Grid>
  );
}

export default JoinBlock;
