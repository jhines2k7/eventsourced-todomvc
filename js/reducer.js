export default function reduce(events) {
    "use strict";

    return events.reduce( (state, event) => {
        if(event.topic === 'todo.add') {
            let todos = state.todos.slice();
            
            todos.splice(todos.length - 1, 0, event.data)
            
            state.todos = todos;
        }

        return state;
    }, {
        todos: [],
        itemsLeft: 0,
    });
}
