'use strict';

var _messages = [
    {
        id: 'm_1',
        text: 'Hey Jing, want to give a Flux talk at ForwardJS?'
    },
    {
        id: 'm_2',
        text: 'Seems like a pretty cool conference.'
    },
    {
        id: 'm_3',
        text: 'Sounds good.  Will they be serving dessert?'
    },
    {
        id: 'm_4',
        text: 'Hey Dave, want to get a beer after the conference?'
    },
    {
        id: 'm_5',
        text: 'Totally!  Meet you at the hotel bar.'
    },
    {
        id: 'm_6',
        text: 'Hey Brian, are you going to be talking about functional stuff?'
    },
    {
        id: 'm_7',
        text: 'At ForwardJS?  Yeah, of course.  See you there!'
    }
];

module.exports = {

    name: 'list', 
    read(req, resource, params, config, callback) {
       callback(null, _messages);
    },
    create(req, resource, params, body, config, callback) {
         console.log("creation");
        _messages.push({
            id: params.id,
            text: params.text
        });

        callback(null, _messages);
    }
    //update (resource, params, body, config, callback) {},
    //del (resource, params, config, callback) {}

};
