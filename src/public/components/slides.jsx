/** @jsx React.DOM */
var _ = require('lodash');

var React = require('react/addons'),
    DiffLink = require("./DiffLink.js"),
    Navigator = require('../util/navigator'),

    NavStore = require("../stores/NavStore");

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

function select(property, obj){
   return obj[property || "default"];
}

var slideMixin = {
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

   componentWillUpdate(nextProps, nextState){
      this.previousSelection = this.state.selection;
   },
   shouldComponentUpdate(nextProps, nextState){
      return this.state.slideIndex === nextState.slideIndex;
   }
}

var listMixin = {
   nextPoint (){
      var selection = _.parseInt(this.state.selection);
      if (selection !== this.points.length){
         var pointIndex = selection + 1 || 1;
         return this.state.mountPoint + "/selection/" + pointIndex;
      } 
      return "javascript:;";
   },
   getPoints(){
      return this.points.slice(0, _.parseInt(this.state.selection) || 0);
   }
}

var FirstSlide = React.createClass({
   mixins: [slideMixin, listMixin],
   points: [
         <p style={{textAlign: "left"}} key={0}>Lots of Buzzwords</p>,
         <ul key={1}>
            <li> Isomorphic - "same form", not used precisely right in mathematical sense, but basically means context agnostic application (for server and client)</li>
         </ul>,
         <ul key={2}>
            <ul><li>This gives a bunch of interesting and useful properties automatically</li></ul>
         </ul>,
         <ul key={3}>
            <li> Flux - architecture to make React (view layer) less error prone and tedious, means "flow"</li>
         </ul>
   ],
   render(){

      return ( 
         <div className="centered">
            <DiffLink className="block-link" href={this.nextPoint()}>
               <h1>Isomorphic Flux Architecture</h1>
               <h2>for web applications</h2>
               <ReactCSSTransitionGroup className="list"
                     transitionName="selection" 
                     component={React.DOM.div}>
                  {this.getPoints()}
               </ReactCSSTransitionGroup>
            </DiffLink>
         </div>
      )
   }
});

var MotivationSlide = React.createClass({
   mixins: [slideMixin, listMixin],
   points: [
      <li key={0}>Single page applications provide rich user experiences</li>,
      <ul key="0a"><li>Prerender application for initial page load and SEO</li></ul>,
      <ul key="0b"><ul><li>Caching main application javascript effectively "installs" the application, but does so after the client gets a rendering</li></ul></ul>,
      <ul key="0c"><li>Switch to pure data for subsequent navigations automatically</li></ul>,
      <ul key="0d"><li>Provide transitions between discrete site locations</li></ul>,
      <li key={2}>Must maintain linkability to arbitrary page locations</li>,
      <li key={3}>Want unobtrusive javascript for browser compatability</li>,
      <li key={4}>Use Flux architecture for correctness and simplicity</li>
   ],
   render(){

      return ( 
         <div className="centered" onClick={this.nextPoint}>
            <DiffLink className="block-link" href={this.nextPoint()}>
               <h1 >Motivation - Uncompromizing single page applications</h1>
               <ul>
                  <ReactCSSTransitionGroup className="list"
                        transitionName="selection" 
                        component={React.DOM.div}>
                     {this.getPoints()}
                  </ReactCSSTransitionGroup>
               </ul>
            </DiffLink>
         </div>
      )
   }
});

var OverviewSlide = React.createClass({
   mixins: [slideMixin, listMixin],
   points: [
      <li key={0}> React - view layer, renders the state declaratively </li>,
      <li key={1}> Stores - the state, groups data logically and controls modification </li>,
      <li key={2}> Actions - modify the state </li>,
      <li key={3}> Router - runs actions </li>
   ],
   render(){

      return ( 
         <div className="centered" onClick={this.nextPoint}>
            <DiffLink className="block-link" href={this.nextPoint()}>
               <h1>Overview</h1>
               <ul>
                  <ReactCSSTransitionGroup className="list"
                        transitionName="selection" 
                        component={React.DOM.div}>
                     {this.getPoints()}
                  </ReactCSSTransitionGroup>
               </ul>
            </DiffLink>
         </div>
      )
   }
});

var tabsMixin = {
   getLink (value){
      var href = this.state.mountPoint;
      if (this.state.selection != value){
         href += "/selection/" + value;
      }
      return href;
   }
}

var ReactSlide = React.createClass({
   mixins: [slideMixin, tabsMixin],
   render(){

      var getLink = this.getLink;

      return <div>
         <h1 className="centered">React</h1>
         <ul className="nav-list">
            <li><DiffLink href={getLink("declarative")}>Declarative</DiffLink></li>
            <li><DiffLink href={getLink("composable")}>Composable</DiffLink></li>
            <li><DiffLink href={getLink("modular")}>Trivial Modularity</DiffLink></li>
            <li><DiffLink href={getLink("performant")}>Performant</DiffLink></li>
            <li><DiffLink href={getLink("javascript")}>Plain Javascript</DiffLink></li>
            <li><DiffLink href={getLink("caveats")}>Caveats</DiffLink></li>
         </ul>
         <ReactCSSTransitionGroup 
               transitionName="selection" 
               className="selection"
               component={React.DOM.div}>
            {select(this.state.selection, {
               declarative: 
                  <div key="selectedTab"> 
                     React is declarative, 
                     declarative is cool. 
                     <pre>                        
                        {
                           "<SomeComponent>\n" +
                           "   <ChildComponent someProperty={this.state.interestingData} />\n" +
                           "   {when(this.state.someCondition,\n" +
                           "     <ConditionallyRenderedComponent />\n" +
                           "   )}\n" +
                           "   <div>Interpolate {this.props.someProperty} as text</div>\n" +
                           "</SomeComponent>"
                        }
                     </pre>
                  </div>,
               composable: 
                  <div key="selectedTab"> Write less, do more 
                     <pre>{
                        "<SomeParentControllerTypeComponent>\n" +
                        "   <VeryParticularUtilityComponentWithComplexLifeCycleMethods onChange={this.handleTheChange} />\n" +
                        "</SomeParentControllerTypeComponent>"

                     }</pre>
                  </div>,
               modular: 
                  <div key="selectedTab">I don't know where I am!
                     <pre>{
                        "var ComplicatedComponent = React.createClass({\n" +
                        "   getInitialState: function() {\n" +
                        "      return {\n" +
                        "         derivedInfo: null\n" +
                        "      }\n" +
                        "   },\n" +
                        "   componentDidMount: function(){\n" +
                        "      setUpTheStateAndStuff();\n" +
                        "      maybeItsAsycOrWhatever();\n" +
                        "   },\n" +
                        "   componentWillUnmount: function(){\n" +
                        "      cleanUpMess();\n" +
                        "   },\n" +
                        "   render: function() {\n" +
                        "     return <div>{this.state.derivedInfo}</div>;\n" +
                        "   }\n" +
                        "});"
                     }</pre>
                  </div>,
               performant: 
                  <div key="selectedTab">
                     <ul>
                        <li>Uses virtual dom</li>
                        <li>Diffs against previous state to do minimal DOM manipulation</li>
                        <li>Abstracts away some browser differences automatically (synthetic events and virtual elements)</li>
                     </ul> 
                  </div>,
               javascript: 
                  <div key="selectedTab">
                     JSX uses plain javascript for interpolation
                     <pre>{
                        "function select(property, obj){\n" +
                        "   return obj[property || \"default\"];\n" +
                        "}"
                     }</pre>
                     <pre>{
                        "var SomeComponent = React.createClass({\n" + 
                        "   render: function() { \n" + 
                        "      <div>\n" + 
                        "         {select(this.props.selection, {\n" + 
                        "            something: <p>Something interesting</p>,\n" + 
                        "            somethingElse: <p>Something uninteresting</p>\n" + 
                        "         })}\n" + 
                        "      </div>\n" + 
                        "\n" + 
                        "      <div>\n" + 
                        "         <ul>\n" + 
                        "            {someList.map(function(item){\n" + 
                        "               return <li>{item.name}</li>;\n" + 
                        "            })}\n" + 
                        "         </ul>\n" + 
                        "      </div>\n" + 
                        "   }\n" + 
                        "});"
                     }</pre>
                  </div>,
               caveats: 
                  <div key="selectedTab">
                     <ul>
                        <li>React is somewhat opinionated. Argues traditional separation of templates from logic is separating a single concern.</li>
                        <li>Can be excessively optimistic. Sometimes when diffing or updating it won't know when a component is a new one or the same one with changed properties (and thus won't know which life cycle methods to call).
                           <ul>
                              <li>Can be solved by passing component a key prop which identifies it.</li>
                              <li>Likewise, passing the same key to different looking elements can prevent lifecycle methods from firing</li>
                           </ul>
                        </li>
                     </ul>
                  </div>
            })}
         </ReactCSSTransitionGroup>

      </div>
   }

});

var FluxSlide = React.createClass({
   mixins: [slideMixin, tabsMixin],
   render(){

      var getLink = this.getLink;

      return <div>
         <h1 className="centered">Flux</h1>
         <ul className="nav-list">
            <li><DiffLink href={getLink("flow")}>Purpose</DiffLink></li>
            <li><DiffLink href={getLink("stores")}>Stores</DiffLink></li>
            <li><DiffLink href={getLink("react")}>React</DiffLink></li>
            <li><DiffLink href={getLink("dispatcher")}>Dispatcher</DiffLink></li>
         </ul>
         <ReactCSSTransitionGroup
               className="selection"
               transitionName="selection" 
               component={React.DOM.div}>
            {select(this.state.selection, {
               flow: 
                  <div key="selection">
                     <p>Flux means flow. It is an arcitecture that takes advantage of React's declarative rendering, while simplifying data flow and assisting with correctness.</p>

                     <p>Flow indicates a unidirectional cycle, where <code>actions -> stores -> view -> actions</code>. 
                        The flow prevents any feedback from happening, and allows the view to register directly with the state/stores what data it wants to receive.
                     </p>

                  </div>,
               stores: 
                  <div key="selection" style={{width:"440px", margin: "0 auto"}}>
                     <pre>{
                        "var BaseStore = require('dispatchr/utils/BaseStore');\n" +
                        "\n" +
                        "var handlers = {\n" +
                        "   'SOME_MESSAGE': 'messageHandler',\n" +
                        "};\n" +
                        "\n" +
                        "class ExampleStore extends BaseStore {\n" +
                        "   constructor(dispatcher) {\n" +
                        "      this.dispatcher = dispatcher;\n" +
                        "      this.payloads = [];\n" +
                        "   }\n" +
                        "   messageHandler (payload) {\n" +
                        "   \n" +
                        "      this.payloads.push(payload);\n" +
                        "\n" +
                        "      this.emitChange();\n" +
                        "   }\n" +
                        "   getPayloads(){\n" +
                        "      return this.payloads;\n" +
                        "   }\n" +
                        "\n" +
                        "   dehydrate(){\n" +
                        "      return this.payloads;\n" +
                        "   }\n" +
                        "   rehydrate(payloads){\n" +
                        "      this.payloads = payloads;\n" +
                        "   }\n" +
                        "\n" +
                        "}\n" +
                        "\n" +
                        "ExampleStore.storeName = 'ExampleStore';\n" +
                        "ExampleStore.handlers = handlers;\n" +
                        "module.exports = ExampleStore;"
                     }</pre>


                  </div>,
               react: 
                  <div key="selection">
                     fetcher slide
                  </div>,
               dispatcher: 
                  <div key="selection">
                     fetcher slide
                  </div>,
            })}
         </ReactCSSTransitionGroup>

      </div>
   }

});

var IsomorphicSlide = React.createClass({
   mixins: [slideMixin, tabsMixin],
   render(){

      var getLink = this.getLink;

      return <div>
         <h1 className="centered">Isomorphic Applications</h1>
         <ul className="nav-list">
            <li><DiffLink href={getLink("fetcher")}>Fetcher</DiffLink></li>
            <li><DiffLink href={getLink("stores")}>Flux - Stores</DiffLink></li>
            <li><DiffLink href={getLink("react")}>Flux - React</DiffLink></li>
            <li><DiffLink href={getLink("dispatcher")}>Flux - Dispatcher</DiffLink></li>
            <li><DiffLink href={getLink("router")}>Router</DiffLink></li>
         </ul>
         <ReactCSSTransitionGroup
               className="selection"
               transitionName="selection" 
               component={React.DOM.div}>
            {select(this.state.selection, {
               fetcher: 
                  <div key="selection">
                     fetcher slide
                  </div>,
               stores: 
                  <div key="selection">
                     fetcher slide
                  </div>,
               react: 
                  <div key="selection">
                     fetcher slide
                  </div>,
               dispatcher: 
                  <div key="selection">
                     fetcher slide
                  </div>,
            })}
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
   FirstSlide,
   MotivationSlide,
   OverviewSlide,
   ReactSlide,
   FluxSlide,
   IsomorphicSlide
];

module.exports = slides;
