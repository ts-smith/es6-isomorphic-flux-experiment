/**
 * @jsx React.DOM
 */

var React = require('react/addons'),
    NavStore = require('../stores/NavStore'),
    DiffLink = require('./DiffLink'),
    slides = require('./slides.js');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

function when(predicate, component){
   if (predicate) return component;
}

var Application = React.createClass({
   getInitialState(){
      var context = this.props.context;
      this.NavStore = context.getStore(NavStore);
      return this.getStateFromStores();
   },
   getStateFromStores(){
      return this.NavStore.getRoutingValues("slideIndex");
   },
   onChange(){
      this.setState(this.getStateFromStores());
   },
   componentDidMount(){
      //could listen with finer granularity than here
      this.NavStore.addChangeListener(this.onChange);
   },
   componentWillUnmount(){
      this.NavStore.removeChangeListener(this.onChange);
   },

   componentWillUpdate(nextProps, nextState){
      this.previousIndex = this.state.slideIndex;
   },

   render () {

      var direction = this.state.slideIndex > this.previousIndex? "forward" : "backward";
      var SlideClass = slides[this.state.slideIndex];

      return (
         <div className="container">
            <div>
               {when (slides[this.state.slideIndex - 1], 
                  <DiffLink href={"/slide/" + (this.state.slideIndex - 1)}>Back</DiffLink> )}
               {when (slides[this.state.slideIndex + 1], 
                  <DiffLink href={"/slide/" + (this.state.slideIndex + 1)}>Forward</DiffLink> )}
            </div>
            <ReactCSSTransitionGroup className={direction} transitionName="slides">
               <div className="slide" key={this.state.slideIndex}>
                  <SlideClass context={this.props.context}/>
               </div>
            </ReactCSSTransitionGroup>
         </div>
      )
   }

});

module.exports = Application;
