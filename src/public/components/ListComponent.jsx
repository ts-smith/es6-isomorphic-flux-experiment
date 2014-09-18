/**
 * @jsx React.DOM
 */

var React = require('react'),
    ListStore = require('../stores/ListStore');

var ListComponent = React.createClass({
   getInitialState(){
      var context = this.props.context;
      this.ListStore = context.getStore(ListStore); //I think getStore is from dispatcher automatically
      return {
         listItems: this.ListStore.getAll()
      }
   },
   onChange(){
      this.setState(this.ListStore.getAll());
   },
   componentDidMount(){
      this.ListStore.addChangeListener(this.onChange);
   },
   componentDidUnmount(){this.onChange},

   render () {
      var listItems = this.state.listItems.map(message => {
         return <p key={message.id}>{message.text}</p>
      });
      return (
         <div className="list">
            {listItems}
         </div>
      );
   }

});

module.exports = ListComponent;
