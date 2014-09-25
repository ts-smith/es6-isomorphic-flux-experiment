/** @jsx React.DOM */

var React = require('react');
var createMessage = require('../actions/createMessage');

var ENTER_KEY_CODE = 13;

var MessageComposer = React.createClass({

    getInitialState: function() {
        return {text: ''};
    },

    render: function() {
        return (
            <textarea
            className="message-composer"
            name="message"
            value={this.state.text}
            onChange={this._onChange}
            onKeyDown={this._onKeyDown}
            />
            );
    },

    _onChange: function(event, value) {
        this.setState({text: event.target.value});
    },

    _onKeyDown: function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            console.log("what");
            var text = this.state.text.trim();
            if (text) {
                this.props.context.executeAction(createMessage, {
                    text: text
                });
            }
            this.setState({text: ''});
        }
    }

});

module.exports = MessageComposer;
