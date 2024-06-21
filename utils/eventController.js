const Event = require('../schemas/event');
const Rank = require('../schemas/rank');
const Bucket = require('../schemas/bucket');
const {NotFoundError} = require('./errors')

async function eventController(action) {
    if(action === 'start') {
        try {
            const event = new Event();
            await event.save();    
        } catch(err) {
            console.error(err);
        }
    }
    if(action === 'stop') {
        try {
            const event = await Event.findOneAndUpdate({state: 'started'}, {$set: {state: 'ended' }});
            if(!event) {
                throw(NotFoundError);
            }
            const eventId = event.id;
            const bucketsArray = await Bucket.find({eventId});

            let RanksArray = [];
            bucketsArray.forEach(bucket => {
                const sortedUsersData = bucket.usersData.sort((a, b) => b.goldAmount - a.goldAmount);
                const usersDataWithRanks = sortedUsersData.map((user, index) => ({
                    eventId: bucket.eventId,
                    userId: user.userId,
                    rank: 199 - index
                    }));

                RanksArray = RanksArray.concat(usersDataWithRanks);
            });
            console.log(RanksArray);
            await Rank.insertMany(RanksArray);
            
        } catch(err) {
            console.error(err);
        }
    }
    
}

module.exports = eventController;