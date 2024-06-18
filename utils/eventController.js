const Event = require('../schemas/event');
const {NotFoundError, ServerError} = require('./errors')

async function eventController(action) {
    if(action === 'start') {
        try {
            const event = new Event({});
            await event.save();    
        } catch(err) {
            res.json(ServerError);
        }
    }
    if(action === 'stop') {
        try {
            const event = await Event.findOneAndUpdate({state: 'started'}, {$set: {state: 'ended' }});
            if(!event) {
                throw(NotFoundError);
            }
        } catch(err) {
            res.json(err);
        }
    }
    
}

module.exports = eventController;