'use strict';

var BaseStore = require('dispatchr/utils/BaseStore');

//util.inherits(MessageStore, BaseStore);
class ListStore extends BaseStore {
   constructor(dispatcher) {
      this.dispatcher = dispatcher;
      this.messages = {};
      this.sortedByDate = [];
   }
   receiveListItems  (messages) {
       var self = this;
       messages.forEach(function (message) {
           self.messages[message.id] = message;
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
      return this.sortedByDate;
   }
   getAllUnsorted() {
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
ListStore.handlers = {
    'RECEIVE_LIST_ITEMS': 'receiveListItems'
};

module.exports = ListStore;
