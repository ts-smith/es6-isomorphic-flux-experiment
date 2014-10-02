/** @jsx React.DOM */

var React = require('react'),
    Navigator = require("../util/navigator");

var DiffLink = React.createClass({
   getDefaultProps () {
      return {
         optimize: true
      };
   },
   runActions(event){

      if (window.history && window.history.pushState){
         event.stopPropagation();

         Navigator.navigateTo(this.props.href, this.props.optimize);

         return false;
      }
   },

   render() {
      return this.transferPropsTo ( 
         <a onClick={this.runActions}>{this.props.children}</a>
      )
   }

});

module.exports = DiffLink;

