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
            const RanksArray = await Bucket.aggregate([
                { $match: { eventId } },
                { $unwind: "$usersData" },
                { $sort: { "usersData.goldAmount": -1 } },
                { 
                    $group: {
                        _id: "$_id",
                        eventId: { $first: "$eventId" },
                        createdAt: { $first: "$createdAt" },
                        usersData: { $push: "$usersData" }
                    }
                },
                {
                    $project: {
                        eventId: 1,
                        createdAt: 1,
                        ranks: {
                            $map: {
                                input: { $range: [0, { $size: "$usersData" }] },
                                as: "index",
                                in: {
                                    userId: { $arrayElemAt: ["$usersData.userId", "$$index"] },
                                    rank: { $subtract: [199, "$$index"] },
                                }
                            }
                        }
                    }
                },
                { $unwind: "$ranks" },
                {
                    $replaceRoot: {
                        newRoot: {
                            eventId: "$eventId",
                            userId: "$ranks.userId",
                            createdAt: "$ranks.createdAt",
                            rank: "$ranks.rank"
                        }
                    }
                }
            ]);
            
            for (const rank of RanksArray) {
                await (new Rank(rank)).save();
            }

        } catch(err) {
            console.error(err);
        }
    }
    
}

module.exports = eventController;