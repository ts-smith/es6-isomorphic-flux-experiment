'use strict';

var _ = require("lodash");

var BaseStore = require('dispatchr/utils/BaseStore');

var handlers = {
   'RECEIVE_ROUTING_VALUES': 'receiveRoutingValues',
   'NAVIGATION': 'receiveRoutingValues'
};

//util.inherits(MessageStore, BaseStore);
class NavStore extends BaseStore {
   constructor(dispatcher) {
      this.dispatcher = dispatcher;
      this.routingValues = {
         slideIndex: -1,
         selection: -1,
         mountPoint: ""
      };
   }
   receiveRoutingValues (keyValues) {
      _.assign(this.routingValues, keyValues);

      this.emitChange();
   }

   getRoutingValues(){
      if (arguments.length > 0){
         return _.pick(this.routingValues, arguments);
      }

      return this.routingValues;
   }
   dehydrate(){
      return {
         routingValues: this.routingValues
      }
   }
   rehydrate({routingValues}){
      //could do object.define property around here
      this.routingValues = _.cloneDeep(routingValues);
   }

}

NavStore.storeName = 'NavStore';
NavStore.handlers = handlers;
module.exports = NavStore;
