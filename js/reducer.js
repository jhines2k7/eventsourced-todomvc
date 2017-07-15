export default function reduce(events) {
    "use strict";

    let toggleState = {};

    /* 
    toggleState = {
        0: true,
        2: false,
        3: false
    }
    */

    return events.reduce( (state, event) => {
        if(event.topic === 'todo.add') {            
            state.todos.push(event.data);
        }

        if(event.topic === 'increment-item-count') {
            state.itemsLeft++;
        }

        if(event.topic === 'todo.toggle') {
            toggleState[event.data] = !toggleState[event.data];

            state.todos[event.data].complete =  toggleState[event.data];
        }

        return state;
    }, {
        todos: [],
        itemsLeft: 0,
    });
}