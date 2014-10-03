/** @jsx React.DOM */

var React = require('react/addons'),
    DiffLink = require("./DiffLink.js"),

    NavStore = require("../stores/NavStore");

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


var DeepSlide = React.createClass({
   getInitialState(){
      var context = this.props.context;
      this.NavStore = context.getStore(NavStore); 

      return this.getStateFromStores();
   },
   
   getStateFromStores(){
      return this.NavStore.getRoutingValues(
         "slideIndex", 
         "selection", 
         "mountPoint");
   }, 
   onChange(){
      this.setState(this.getStateFromStores());
   },
   componentDidMount(){
      this.NavStore.addChangeListener(this.onChange);
   },
   componentWillUnmount(){
      this.NavStore.removeChangeListener(this.onChange);
   },

   shouldComponentUpdate(nextProps, nextState){
      return this.state.slideIndex === nextState.slideIndex;
   },
   render(){

      var selectedInfo = null;

      if (this.state.selection == 1){
         selectedInfo = (
            <div key={1}> Look at this mad selection yo </div>
         )
      }
      else if (this.state.selection == 2){
         selectedInfo = (
            <div key={2}> this isn't as cool </div>
         )
      }

      var cx = React.addons.classSet;
      var classes = cx({
         'selection': true,
      });

      return <div style={{border: "3px solid black"}}>
         <ul>
            <li><DiffLink href={this.state.mountPoint}>Unselect</DiffLink></li>
            <li><DiffLink href={this.state.mountPoint + "/selection/" + 1}>Select 1</DiffLink></li>
            <li><DiffLink href={this.state.mountPoint + "/selection/" + 2}>Select 2</DiffLink></li>
         </ul>
         <ReactCSSTransitionGroup className={classes} transitionName="selection" component={React.DOM.div}>
            {selectedInfo}
         </ReactCSSTransitionGroup>

      </div>
   }

});

function constant(jsx){
   return React.createClass({
      shouldComponentUpdate(){return false},
      render(){return jsx}
   });
}

var slides = [

   constant(
      <div style={{backgroundImage: "url(https://i.imgur.com/He7zOrR.jpg)"}}>
         <p>some neat content</p>
      </div>
   ),

   constant(
      <div style={{backgroundImage: "url(https://i.imgur.com/eWlGSdR.jpg)", backgroundSize: "600px"}} />
   ),
   DeepSlide,

   constant(
      <div style={{ backgroundImage: "url(https://i.imgur.com/m6m0FhB.jpg)"}}>
         <p>other</p>
         <p>stuff</p>
      </div>
   ),

   DeepSlide

];

module.exports = slides;
