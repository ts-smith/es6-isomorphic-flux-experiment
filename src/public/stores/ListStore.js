'use strict';

var BaseStore = require('dispatchr/utils/BaseStore');

var handlers = {
   'RECEIVE_LIST_ITEMS': 'receiveListItems',
   'ON_CLIENT': 'getContext'
};

//util.inherits(MessageStore, BaseStore);
class ListStore extends BaseStore {
   constructor(dispatcher) {
      this.dispatcher = dispatcher;
      this.messages = {};
      this.sortedByDate = [];
      this.listeners = 0;
   }
   getContext (context){
      this.context = context;

      //could check for listeners and recursively update list here
      //could have a navigation complete event
         //could listen here, and then check for listeners and update
      //could check to see if the number of listeners goes from 0 to 1 (or  > 0), and then check for updates then
      //could make the rehydration and dehydration act as a monoid that intelligently merges them to keep the up to date
   }

   addChangeListener(){
      ++this.listeners;

      if (this.listeners === 1){
         console.log("should update store");
      }

      BaseStore.prototype.addChangeListener.apply(this, arguments);
   }
   removeChangeListener(){
      --this.listeners;
      BaseStore.prototype.removeChangeListener.apply(this, arguments);
   }



   receiveListItems  (messages) {
       var self = this;
       messages.forEach(function (message) {
           self.messages[message.id] = message.text;
       });
       self.sortedByDate = Object.keys(self.messages);
       self.sortedByDate.sort((a, b) => {
           if (self.messages[a].date < self.messages[b].date) {
               return -1;
           } else if (self.messages[a].date > self.messages[b].date) {
               return 1;
           }
           return 0;
       });
       self.emitChange();
   }
   getAll(){
      return this.messages;
   }
   get(id){
      return this.messages[id];
   }
   dehydrate(){
      return {
         messages: this.messages,
         sortedByData: this.sortedByDate
      }
   }
   rehydrate({messages, sortedByDate}){
      this.messages = messages;
      this.sortedbyDate = sortedByDate;
   }

}

ListStore.storeName = 'ListStore';
ListStore.handlers = handlers;
module.exports = ListStore;
