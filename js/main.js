'use strict';

import Storage from './storage'
import reduce from './reducer'
import EventStore from './eventStore'
import postal from 'postal/lib/postal.lodash'

document.querySelector('.new-todo').addEventListener('keypress', (e) => {
    let key = e.which || e.keyCode;
    
    if (key === 13) {
        EventStore.add(EventStore.events, [{
            channel: 'async',
            topic: 'todo.add',
            data: {
                label: e.currentTarget.value,
                complete: false
            }
        }, {
            channel: 'async',
            topic: 'increment-item-count'
        }]);

        e.currentTarget.value = '';
    }    
}, false);

postal.subscribe({
    channel: 'async',
    topic: 'todo.add',
    callback: function(data, envelope) {
        let state = reduce(EventStore.events);

        renderTodos(state);        
    }.bind(this)
});

postal.subscribe({
    channel: 'async',
    topic: 'todo.remove',
    callback: function(data, envelope) {
        let state = reduce(EventStore.events);

        renderTodos(state);        
    }.bind(this)
});

postal.subscribe({
    channel: 'async',
    topic: 'todo.toggle',
    callback: function(data, envelope) {
        let state = reduce(EventStore.events);        

        renderTodos(state);        
    }.bind(this)
});

function renderTodos(state) {
    let footer = document.querySelector('.footer');
    let label = document.querySelector('label[for="toggle-all"]');
    let input = document.querySelector('.toggle-all');

    if(state.todos.length > 0) {
        footer.style.display = 'block';
        label.style.display = 'block';
        input.style.display = 'block';
    } else {
        footer.style.display = 'none'; 
        label.style.display = 'none'; 
        input.style.display = 'none'; 
    }

    let ul = document.querySelector('.todo-list');

    let span = document.querySelector('.todo-count');
    span.childNodes[1].textContent = state.itemsLeft === 1 ? ' item left' : ' items left'; 

    let strong = document.querySelector('.todo-count strong');
    strong.textContent = state.itemsLeft;

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    state.todos.forEach((todo, idx) => {
        let fragment = document.createDocumentFragment();

        let li = document.createElement('li');       

        let div = document.createElement('div');
        div.className = 'view';
        
        let input = document.createElement('input');
        input.className = 'toggle'
        input.setAttribute('type', 'checkbox');

        if(todo.complete) {
            li.className = 'completed';
            input.checked = true;            
        }
        
        input.addEventListener('click', (e) => {            
            EventStore.add(EventStore.events, [{
                channel: 'async',
                topic: 'todo.toggle',
                data: idx
            }]);
        });        
        
        let label = document.createElement('label');
        label.textContent = todo.label;
        
        let button = document.createElement('button');
        button.className = 'destroy';

        button.addEventListener('click', (e) => {
            //e.stopPropagation();

            EventStore.add(EventStore.events, [{
                channel: 'async',
                topic: 'todo.remove',
                data: idx
            }]);
        });

        div.appendChild(input);
        div.appendChild(label);
        div.appendChild(button);
        li.appendChild(div);

        fragment.appendChild(li);

        ul.appendChild(fragment);
    });

    return ul;
}

Storage.get().then( (events) => {
    EventStore.events = events;

    let state = reduce(events);

    renderTodos(state);
});
