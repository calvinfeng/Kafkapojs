import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import randomSentence from 'random-sentence';

class Application extends React.Component {
  state = {
    connected: false
  };

  handleConnect = () => {
    this.setState({ connected: true });
  };

  handleMessage = (msg) => {
    this.setState({ downstreamMessage: msg });
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

  get downstreamMessage() {
    if (this.state.downstreamMessage) {
      return <p>{this.state.downstreamMessage}</p>;
    }

    return <p>No message yet</p>;
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
        <h1>Producer</h1>
        {this.connectionState}
        {this.downstreamMessage}
      </div>
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(<Application />, document.getElementById('react-application'));
});
