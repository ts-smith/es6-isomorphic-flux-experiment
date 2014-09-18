'use strict';

var username = "samuel l. jackson";
var specialTabs = ["Royale with cheese"]

module.exports = {

    name: 'nav', 
    read(req, resource, params, config, callback) {

       //fake async
       setTimeout(() => { callback(null, {username, specialTabs} ) }, 10);

    }
};
