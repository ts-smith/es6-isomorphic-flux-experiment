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
   shouldComponentUpdate(np, nextState){
      return this.state.slideIndex !== nextState.slideIndex;
   },

   render () {

      var direction = this.state.slideIndex > this.previousIndex? "forward" : "backward";
      var SlideClass = slides[this.state.slideIndex];

      return (
         <div className="container">
            <div className="nav-buttons">
               {when (slides[this.state.slideIndex - 1], 
                  <DiffLink className="left" href={"/slide/" + (this.state.slideIndex - 1)}>
                     <img src="/arrow-left.png" />
                  </DiffLink> )}
               {when (slides[this.state.slideIndex + 1], 
                  <DiffLink className="right" href={"/slide/" + (this.state.slideIndex + 1)}>
                     <img src="/arrow-right.png" />
                  </DiffLink> )}
            </div>
            <ReactCSSTransitionGroup className={direction} transitionName={"slides-" + direction}>
               <div className="slide" key={this.state.slideIndex}>
                  <SlideClass context={this.props.context}/>
               </div>
            </ReactCSSTransitionGroup>
         </div>
      )
   }

});

module.exports = Application;
