/**
 * @jsx React.DOM
 */

var React = require('react/addons'),
    PresentationStore = require('../stores/PresentationStore'),
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
      this.PresentationStore = context.getStore(PresentationStore); //I think getStore is from dispatcher automatically
      this.NavStore = context.getStore(NavStore);
      return this.getStateFromStores();
   },
   getStateFromStores(){
      //slideIndex, direction
      return this.PresentationStore.getSlide();
   },
   onChange(){
      this.setState(this.getStateFromStores());
   },
   componentDidMount(){
      //could listen with finer granularity than here
      this.PresentationStore.addChangeListener(this.onChange);
      this.NavStore.addChangeListener(this.onChange);
   },
   componentWillUnmount(){
      this.PresentationStore.removeChangeListener(this.onChange);
      this.NavStore.removeChangeListener(this.onChange);
   },

   render () {

      return (
         <div className="container">
            <div>
               {when (slides[this.state.slideIndex - 1], 
                  <DiffLink href={"/slide/" + (this.state.slideIndex - 1)}>Back</DiffLink> )}
               {when (slides[this.state.slideIndex + 1], 
                  <DiffLink href={"/slide/" + (this.state.slideIndex + 1)}>Forward</DiffLink> )}
            </div>
            <ReactCSSTransitionGroup transitionName="slides">
               <div className="slide" key={this.state.slideIndex}>
                  {slides[this.state.slideIndex]}
               </div>
            </ReactCSSTransitionGroup>
         </div>
      )
   }

});

module.exports = Application;
