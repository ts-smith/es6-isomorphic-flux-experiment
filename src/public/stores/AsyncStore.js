'use strict';

var BaseStore = require('dispatchr/utils/BaseStore');

var handlers = {
   'RECEIVE_SOME_DATA': 'receiveSomeData',
   'RECEIVE_TEXT': 'receiveText'
   
};

//util.inherits(MessageStore, BaseStore);
class AsyncStore extends BaseStore {
   constructor(dispatcher) {
      this.dispatcher = dispatcher;
      this.data = null;
      this.text = null;
   }
   receiveSomeData (data) {
      this.data = data;
      this.emitChange();

   }
   receiveText (text) {
      this.text = text;
      this.emitChange();
   }

   getText(){
      return this.text;
   }
   getData(){
      return this.data;
   }
   dehydrate(){
      return {
         data: this.data,
         text: this.text,
      }
   }
   rehydrate({text, data}){
      this.text = text;
      this.data = data;
   }

}

AsyncStore.storeName = 'AsyncStore';
AsyncStore.handlers = handlers;
module.exports = AsyncStore;
