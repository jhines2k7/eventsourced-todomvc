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
            state.itemsLeft++;

            toggleState[state.itemsLeft - 1] = false;
        }

        if(event.topic === 'todo.remove') {
            state.todos.splice(event.data, 1);
            
            if(toggleState[event.data] === false) {
                state.itemsLeft--;
            }

            delete toggleState[event.data];
        }

        if(event.topic === 'todo.toggle') {
            toggleState[event.data] = !toggleState[event.data];

            state.todos[event.data].complete = toggleState[event.data];

            if(toggleState[event.data] === false) {
                state.itemsLeft++;
            } else {
                state.itemsLeft--;
            } 
        }

        return state;
    }, {
        todos: [],
        itemsLeft: 0,
        currentFilter: 'all'
    });
}