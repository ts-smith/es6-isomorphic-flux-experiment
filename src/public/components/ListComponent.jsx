/**
 * @jsx React.DOM
 */

var React = require('react'),
    MessageComposer = require('./MessageComposer'),
    ListStore = require('../stores/ListStore'),
    NavStore = require('../stores/NavStore'),
    AsyncStore = require('../stores/AsyncStore'),
    DiffLink = require('./DiffLink');

var ListComponent = React.createClass({
   getInitialState(){
      var context = this.props.context;
      this.ListStore = context.getStore(ListStore); //I think getStore is from dispatcher automatically
      this.NavStore = context.getStore(NavStore);
      this.AsyncStore = context.getStore(AsyncStore);
      return this.getStateFromStores();
   },
   getStateFromStores(){
      return {
         listItems: this.ListStore.getAll(),
         username: this.NavStore.getUsername(),
         specialTabs: this.NavStore.getSpecialTabs(),
         routingInfo: this.NavStore.getRoutingValues(),
         data: this.AsyncStore.getData(),
         text: this.AsyncStore.getText()
      }
   },
   onChange(){
      this.setState(this.getStateFromStores());
   },
   componentDidMount(){
      //could listen with finer granularity than here
      this.ListStore.addChangeListener(this.onChange);
      this.NavStore.addChangeListener(this.onChange);
      this.AsyncStore.addChangeListener(this.onChange);
   },
   componentWillUnmount(){
      this.ListStore.removeChangeListener(this.onChange);
      this.NavStore.removeChangeListener(this.onChange);
      this.AsyncStore.removeChangeListener(this.onChange);
   },

   render () {
      var listItems = Object.keys(this.state.listItems).map(messageId => {
         return <p key={messageId}>{this.state.listItems[messageId]}</p>
      });

      var view;

      var viewKey = this.state.routingInfo.view;
      switch (viewKey){
         case "something-else": view = (
            <div className="something-else" key={viewKey}>
               <p> this is another view determined by an arbitrary routing property </p>
            </div>
         ); break;
         case "async": view = (
            <div key={viewKey}> isnt that something
               <p> "{this.state.data}" took a long time to get </p>
               <p> "{this.state.text}" took a short time to get </p>
            </div>
         ); break;
         case "list": 
         default: view = (
            <div className="list" key={viewKey}>
               <h3>Yo</h3>
               {listItems}
               <h3>End</h3>
               <MessageComposer context={this.props.context} />
            </div>
         ); 
      }

      return (
         <div>
            <h2>{this.state.username}</h2>
            <ul>
               <li><DiffLink href="/list">Home</DiffLink></li>
               <li><DiffLink href="/something-else">About</DiffLink></li>
               <li><DiffLink href="/async/one">tab one</DiffLink></li>
               <li><DiffLink href="/async/two">tab two</DiffLink></li>
               <li><a>{this.state.specialTabs}</a></li>
            </ul>
            <br/>
            {view}
         </div>
      );
   }

});

module.exports = ListComponent;
