'use strict';

var _ = require("lodash");

var BaseStore = require('dispatchr/utils/BaseStore');

var handlers = {
   'RECEIVE_INDEX': 'setSlide',
   'NAVIGATION': 'navigate'
};

//util.inherits(MessageStore, BaseStore);
class PresentationStore extends BaseStore {
   constructor(dispatcher) {
      this.dispatcher = dispatcher;
      this.slideIndex = 0;
      this.direction = null;
   }
   setSlide ({slideIndex, direction}) {
      this.slideIndex = slideIndex;
      this.direction = direction; 
      this.emitChange();
   }
   navigate() {}

   getSlide(){
      return {
         slideIndex: this.slideIndex,
         direction: this.direction
      }
   }
   dehydrate(){
      return this.getSlide();
   }
   rehydrate({slideIndex, direction}){
      this.slideIndex = slideIndex;
      this.direction = direction; 
   }

}

PresentationStore.storeName = 'PresentationStore';
PresentationStore.handlers = handlers;
module.exports = PresentationStore;
