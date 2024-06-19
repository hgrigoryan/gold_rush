const Event = require('../schemas/event');
const Rank = require('../schemas/rank');
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
            //createing rewards document per bucket for ended event
            const RanksArray = await Bucket.aggregate([
                { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
                { $unwind: "$usersData" },
                { $sort: { "usersData.goldAmount": -1 } },
                { 
                    $group: {
                        bucketId: "$_id",
                        eventId: { $first: "$eventId" },
                        createdAt: { $first: "$createdAt" },
                        usersData: { $push: "$usersData" }
                    }
                },
                {
                    $project: {
                        eventId: 1,
                        createdAt: 1,
                        rewards: {
                            $map: {
                                input: { $range: [0, { $size: "$usersData" }] },
                                as: "index",
                                in: {
                                    userId: { $arrayElemAt: ["$usersData.userId", "$$index"] },
                                    reward: { $subtract: [199, "$$index"] },
                                }
                            }
                        }
                    }
                },
                { $unwind: "$rewards" },
                {
                    $replaceRoot: {
                        newRoot: {
                            eventId: "$eventId",
                            userId: "$rewards.userId",
                            createdAt: "$rewards.createdAt",
                            reward: "$rewards.reward"
                        }
                    }
                }
            ]);
            
            for (const rank of RanksArray) {
                await Rank.create(rank);
            }

        } catch(err) {
            res.json(err);
        }
    }
    
}

module.exports = eventController;