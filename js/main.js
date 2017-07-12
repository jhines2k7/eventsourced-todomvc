'use strict';

import Storage from './storage'
import reduce from './reducer'
import EventStore from './eventStore'
import postal from 'postal/lib/postal.lodash'

document.querySelector('.new-todo').addEventListener('keypress', function (e) {
    let key = e.which || e.keyCode;
    
    if (key === 13) {
        EventStore.add(EventStore.events, [{
            channel: 'async',
            topic: 'todo.add',
            data: {
                label: e.currentTarget.value,
                complete: false
            }
        }]);

        e.currentTarget.value = '';
    }    
}, false);

postal.subscribe({
    channel: 'async',
    topic: 'todo.add',
    callback: function(data, envelope) {
        let state = reduce(EventStore.events);

        let ul = document.querySelector('.todo-list');

        let span = document.querySelector('.todo-count');
        span.childNodes[1].textContent = state.itemsLeft === 1 ? ' item left' : ' items left'; 

        let strong = document.querySelector('.todo-count strong');
        strong.textContent = state.itemsLeft;

        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        state.todos.forEach((todo) => {
            let fragment = document.createDocumentFragment();

            let li = document.createElement('li');
            
            let div = document.createElement('div');
            div.className = 'view';
            
            let input = document.createElement('input');
            input.className = 'toggle'
            input.setAttribute('type', 'checkbox');
            
            let label = document.createElement('label');
            label.textContent = todo.label;
            
            let button = document.createElement('button');
            button.className = 'destroy';

            div.appendChild(input);
            div.appendChild(label);
            div.appendChild(button);
            li.appendChild(div);

            fragment.appendChild(li);

            ul.appendChild(fragment);
        });        
    }.bind(this)
});

Storage.get().then( (events) => {
    EventStore.events = events;

    let state = reduce(events);
});
