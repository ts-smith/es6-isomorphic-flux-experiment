'use strict';

var _ = require("lodash");

var BaseStore = require('dispatchr/utils/BaseStore');

var handlers = {
   'RECEIVE_NAV_DETAILS': 'receiveNavDetails',
   'RECEIVE_ROUTING_VALUES': 'receiveRoutingValues'
   
};

//util.inherits(MessageStore, BaseStore);
class NavStore extends BaseStore {
   constructor(dispatcher) {
      this.dispatcher = dispatcher;
      this.username = "";
      this.specialTabs = [];
      this.routingValues = {};
   }
   receiveNavDetails ({username,specialTabs}) {
      this.username = username;
      this.specialTabs = specialTabs; 
      this.emitChange();
   }
   receiveRoutingValues (keyValues) {
      _.assign(this.routingValues, keyValues);

      this.emitChange();
   }

   getUsername(){
      return this.username;
   }
   getSpecialTabs(){
      return this.specialTabs;
   }
   getRoutingValues(){
      return this.routingValues;
   };
   dehydrate(){
      return {
         username: this.username,
         specialTabs: this.specialTabs,
         routingValues: this.routingValues
      }
   }
   rehydrate({username, specialTabs, routingValues}){
      this.username = username;
      this.specialTabs = specialTabs;
      this.routingValues = routingValues;
   }

}

NavStore.storeName = 'NavStore';
NavStore.handlers = handlers;
module.exports = NavStore;
