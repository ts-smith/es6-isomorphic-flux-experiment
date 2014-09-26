/** @jsx React.DOM */

var React = require('react');

var ref = { serial: 0, overtake: false };

var DiffLink = React.createClass({
   getDefaultProps () {
      return {
         atomic: true,
         noOptimize: false
      };
   },
   ref: ref,
   runActions(event){

      if (window.history && window.history.pushState){
         event.stopPropagation();

         var transitionContext = this.props.atomic ? context.clone() : context;

         history[this.ref.overtake ? "replaceState" : "pushState"] ({}, "", this.props.href);

         var contextId = this.ref.serial++;
         this.ref.overtake = true;
         transitionContext.router.runRoute(this.props.href)

         .then(() => {
            if (this.ref.serial == contextId + 1){
               this.ref.overtake = false;
               var newState = transitionContext.dehydrate();
               history.replaceState(newState, "", this.props.href);

               if (this.props.atomic){
                  transitionContext = null;
                  context.rehydrate(newState);
               }

               React.renderComponent(application.getComponent(), mountNode);
            }
         });      
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