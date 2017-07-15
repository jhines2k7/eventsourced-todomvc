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
                state.numCompletedTodos--;
            } else {
                state.itemsLeft--;
                state.numCompletedTodos++;
            } 
        }

        if(event.topic === 'todo.clear.completed') {
            let notCompleted = state.todos.filter( (todo) => {
                if(!todo.complete) {
                    delete toggleState[todo.id];

                    return !todo.complete;
                }
                
            });

            state.todos = notCompleted;
            state.numCompletedTodos = 0;
        }

        if(event.topic === 'todo.filter') {
            let filtered = state.todos.filter( (todo) => {
                if(event.data === 'active') {
                    return !todo.complete;
                } else if(event.data === 'completed') {
                    return todo.complete;
                } else {
                    return todo;
                }                
            });

            state.todos = filtered   
        }

        return state;
    }, {
        todos: [],
        itemsLeft: 0,
        currentFilter: 'all',
        numCompletedTodos: 0
    });
}