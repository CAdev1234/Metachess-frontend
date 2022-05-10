import React, { Component } from "react";

interface IState {
  roomName: string;
}

interface IProps {
  handleCreateRoom: (roomName: string) => void;
  handleJoinRoom: (roomName: string) => void;
  goBack: () => void;
}

class RoomInputs extends Component<IProps, IState> {
  state = {
    roomName: ''
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [e.target.name as keyof IState]: e.target.value });
  }

  handleCreateRoom = () => {
    this.props.handleCreateRoom(this.state.roomName);
  }

  handleJoinRoom = () => {
    this.props.handleJoinRoom(this.state.roomName);
  }

  render() {
    return (
      <div>
        <input value={this.state.roomName} onChange={this.handleChange} name={'roomName'} />
        <button onClick={this.handleCreateRoom}>Create Room</button>
        <button onClick={this.handleJoinRoom}>Join Room</button>
      </div>
    )
  }
}

export default RoomInputs;