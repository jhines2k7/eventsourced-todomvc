import postal from 'postal/lib/postal.lodash'
import Storage from './storage'

export default class EventStore {
    static add(events, newEvents) {
        let allEvents = events.concat(newEvents);

        Storage.set(allEvents);

        this.events = events.concat(newEvents);

        for(let event in newEvents) {
            if(newEvents.hasOwnProperty(event)) {
                postal.publish(newEvents[event]);
            }
        }
    }
}

EventStore.prototype.events = [];