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
      this.slideIndex = -1;
   }
   setSlide ({slideIndex, direction}) {
      this.slideIndex = slideIndex;
      this.emitChange();
   }
   navigate() {}

   getSlide(){
      return {
         slideIndex: this.slideIndex
      }
   }
   dehydrate(){
      return this.getSlide();
   }
   rehydrate({slideIndex}){
      this.slideIndex = slideIndex;
   }

}

PresentationStore.storeName = 'PresentationStore';
PresentationStore.handlers = handlers;
module.exports = PresentationStore;
