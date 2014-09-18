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
      console.log(this.state);
      var listItems = Object.keys(this.state.listItems).map(messageId => {
         return <p key={messageId}>{this.state.listItems[messageId]}</p>
      });
      return (
         <div className="list">
            <h1>Yo</h1>
            {listItems}
            <h2>End</h2>
         </div>
      );
   }

});

module.exports = ListComponent;
