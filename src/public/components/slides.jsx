/** @jsx React.DOM */

var React = require('react');


var slides = [
   <div style={{backgroundImage: "url(https://i.imgur.com/He7zOrR.jpg)"}}>
      <p>some neat content</p>
   </div>,

   <div style={{backgroundImage: "url(https://i.imgur.com/eWlGSdR.jpg)", backgroundSize: "600px"}} />,

   <div style={{ backgroundImage: "url(https://i.imgur.com/m6m0FhB.jpg)"}}>
      <p>other</p>
      <p>stuff</p>
   </div>
];

module.exports = slides;
