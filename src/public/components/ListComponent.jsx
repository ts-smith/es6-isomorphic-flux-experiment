/**
 * @jsx React.DOM
 */

var React = require('react'),
    MessageComposer = require('./MessageComposer'),
    ListStore = require('../stores/ListStore'),
    NavStore = require('../stores/NavStore');

var ListComponent = React.createClass({
   getInitialState(){
      var context = this.props.context;
      this.ListStore = context.getStore(ListStore); //I think getStore is from dispatcher automatically
      this.NavStore = context.getStore(NavStore);
      return this.getStateFromStores();
   },
   getStateFromStores(){
      return {
         listItems: this.ListStore.getAll(),
         username: this.NavStore.getUsername(),
         specialTabs: this.NavStore.getSpecialTabs()
      }
   },
   onChange(){
      this.setState(this.getStateFromStores());
   },
   componentDidMount(){
      //could listen with finer granularity than here
      this.ListStore.addChangeListener(this.onChange);
      this.NavStore.addChangeListener(this.onChange);
   },
   componentDidUnmount(){this.onChange},

   render () {
      var listItems = Object.keys(this.state.listItems).map(messageId => {
         return <p key={messageId}>{this.state.listItems[messageId]}</p>
      });
      return (
         <div>
            <h2>{this.state.username}</h2>
            <ul>
               <li><a>Home</a></li>
               <li><a>About</a></li>
               <li><a>{this.state.specialTabs}</a></li>
            </ul>
            <br/>
            <div className="list">
               <h3>Yo</h3>
               {listItems}
               <h3>End</h3>
               <MessageComposer context={this.props.context} />
            </div>
         </div>
      );
   }

});

module.exports = ListComponent;
