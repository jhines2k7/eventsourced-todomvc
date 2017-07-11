'use strict';

import Storage from './storage'
import reduce from './reducer'
import EventStore from './eventStore'
import postal from 'postal/lib/postal.lodash'

document.getElementById('increment').addEventListener('click', function( event ) {
    EventStore.add(EventStore.events, [{
        channel: 'async',
        topic: 'myapp.increment.count',
    }]);
}, false);

postal.subscribe({
    channel: 'async',
    topic: 'myapp.increment.count',
    callback: function(data, envelope) {
        let state = reduce(EventStore.events);

        //document.getElementById('total').innerHTML = state.total
    }.bind(this)
});

Storage.get().then( (events) => {
    EventStore.events = events;

    //let state = reduce(events);
});
