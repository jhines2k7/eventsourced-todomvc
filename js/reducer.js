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

            toggleState[event.data.id] = false;
        }

        if(event.topic === 'todo.remove') {
            state.todos.splice(event.data.idx, 1);
            
            if(toggleState[event.data.id] === false) {
                state.itemsLeft--;
            }

            delete toggleState[event.data.id];
        }

        if(event.topic === 'todo.toggle') {
            toggleState[event.data.id] = !toggleState[event.data.id];

            state.todos[event.data.idx].complete = toggleState[event.data.id];

            if(toggleState[event.data.id] === false) {
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