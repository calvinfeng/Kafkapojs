import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import uuidv1 from 'uuid/v1';
import Message from './message';


class Application extends React.Component {
  state = {
    connected: false,
    kafkaMessages: []
  };

  handleConnect = () => {
    this.setState({ connected: true });
  };

  handleMessage = (msg) => {
    const msgJSON = JSON.parse(msg);
    setTimeout(() => {
      this.setState({ kafkaMessages: this.state.kafkaMessages.concat([msgJSON]) });
    }, 50);
  };

  componentDidMount() {
    this.socket = io(`${window.location.hostname}:3000`);
    this.socket.on('connect', this.handleConnect);
    this.socket.on('message', this.handleMessage);
  }

  get connectionState() {
    if (this.state.connected) {
      return <p>Stream is connected!</p>;
    }

    return <p>Connecting...</p>;
  }

  get kafkaMessages() {
    return this.state.kafkaMessages.map((msg) => {
      return <Message key={uuidv1()} topic={msg.topic} partition={msg.partition} value={msg.value} />;
    });
  }

  get upstreamMessage() {
    if (this.state.upstreamMessage) {
      return <p>{this.state.upstreamMessage}</p>;
    }

    return <p />;
  }

  render() {
    return (
      <div>
        <h1>Consumer</h1>
        {this.connectionState}
        {this.kafkaMessages}
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Application />, document.getElementById('react-application'));
});
