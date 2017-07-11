export default function reduce(events) {
    "use strict";

    return events.reduce( (state, event) => {
        if(event.topic === 'myapp.increment.count') {
            state.total++;
        }

        return state;
    }, {
        total: 0
    });
}
