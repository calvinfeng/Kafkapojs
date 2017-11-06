import React from 'react';
import PropTypes from 'prop-types';

const Message = (props) => (
  <div className="message">
    <strong>Topic</strong>:{props.topic}
    <strong>partition</strong>:{props.partition}
    <strong>Value</strong>:{props.value}
  </div>
);

Message.PropTypes = {
  topic: PropTypes.string.isRequired,
  partition: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default Message;
