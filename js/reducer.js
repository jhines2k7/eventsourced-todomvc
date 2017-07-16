export default function reduce(events) {
    "use strict";

    return events.reduce( (state, event) => {        
        if(event.topic === 'todo.add') {            
            state.todos.push(event.data);
            state.itemsLeft++;            
        }

        if(event.topic === 'todo.remove') {
            state.todos.splice(event.data.idx, 1);
            
            if(!event.data.wasComplete) {
                state.itemsLeft--;
            }

            state.numCompletedTodos--;
        }

        if(event.topic === 'todo.toggle') {

            state.todos[event.data.idx].complete = event.data.complete;

            if(event.data.complete) {
                state.itemsLeft--;
                state.numCompletedTodos++;
            } else {
                state.itemsLeft++;
                state.numCompletedTodos--;
            } 
        }

        if(event.topic === 'todo.clear.completed') {
            let notCompleted = state.todos.filter( (todo) => {
                if(!todo.complete) {
                    return !todo.complete;
                }
                
            });

            state.todos = notCompleted;
            state.numCompletedTodos = 0;
        }

        if(event.topic === 'todo.filter') {
            state.currentFilter = event.data;   
        }

        return state;
    }, {
        todos: [],
        itemsLeft: 0,
        currentFilter: 'all',
        numCompletedTodos: 0
    });
}