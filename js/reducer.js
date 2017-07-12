export default function reduce(events) {
    "use strict";

    return events.reduce( (state, event) => {
        if(event.topic === 'todo.add') {
            let todos = state.todos.slice();
            
            todos.splice(todos.length, 0, event.data)
            
            state.todos = todos;
        }

        if(event.topic === 'increment-item-count') {
            state.itemsLeft++;
        }

        return state;
    }, {
        todos: [],
        itemsLeft: 0,
    });
}
