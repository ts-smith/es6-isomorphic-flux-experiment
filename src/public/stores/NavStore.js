'use strict';

var BaseStore = require('dispatchr/utils/BaseStore');

var handlers = {
    'RECEIVE_NAV_DETAILS': 'receiveNavDetails'
};

//util.inherits(MessageStore, BaseStore);
class NavStore extends BaseStore {
   constructor(dispatcher) {
      this.dispatcher = dispatcher;
      this.username = "";
      this.specialTabs = [];
   }
   receiveNavDetails ({username,specialTabs}) {
      this.username = username;
      this.specialTabs = specialTabs; 
      this.emitChange();
   }
   getUsername(){
      return this.username;
   }
   getSpecialTabs(){
      return this.specialTabs;
   }
   dehydrate(){
      return {
         username: this.username,
         specialTabs: this.specialTabs
      }
   }
   rehydrate({username, specialTabs}){
      this.username = username;
      this.specialTabs = specialTabs;
   }

}

NavStore.storeName = 'NavStore';
NavStore.handlers = handlers;
module.exports = NavStore;
