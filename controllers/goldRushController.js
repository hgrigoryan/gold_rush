const Event = require("../schemas/event");
const User = require("../schemas/user");
const Bucket = require('../schemas/bucket');
const Errors = require("../utils/errors");

async function getCurrentEvent(req, res) {
    try {
        const currentEvent = await Event.findOne({state: 'started'});
        if(!currentEvent) {
            throw(Errors.NotFoundError);
        }
        res.status(200).json({
            id: currentEvent.id,
            state: currentEvent.state,
            endDate: currentEvent.endDate
        });
    } catch(err) {
        res.json(err);
    }
}

async function addReportedGoldAmount(req, res) {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    const goldAmount = req.params.gold_amount;

    const parsedGoldAmount = parseFloat(goldAmount);
    if(isNaN(parsedGoldAmount) || parsedGoldAmount <= 0) {
        return res.status(400).json('Invalid amount');
    }

    try {
        const eventBuckets = await Bucket.find({eventId});
        if(eventBuckets.length > 0) {
    
            for(const bucket of eventBuckets) {
              const userDataIndex = bucket.userData.findIndex(userData => userData.userId === userId);
        
              if(userDataIndex !== -1) {
                bucket.userData[userDataIndex].amount += parsedGoldAmount;
        
                await bucket.save();
        
                res.status(200).json({message: 'User data updated successfully.'});
                break;
              }
            }

        } else {
            throw(Errors.NotFoundError) ;
            }

    } catch(err) {
        res.json(err);
    }
}

async function getLeaderboard(req, res) {
    const userId = req.params.userId;
    const eventId = req.params.eventId;

    const pipeline = [
        {
          $match: {eventId: eventId}
        },
        {
          $unwind: "$userData"
        },
        {
          $match: {"userData.userId": userId}
        },
        {
          $group: {
            _id: "$_id",
            eventId: { $first: "$eventId" },
            userData: { $push: "$userData" }
          }
        },
        {
          $project: {
            _id: 1,
            eventId: 1,
            userData: { $eventId: { input: "$userData", as: "user", cond: { $eq: ["$$user.userId", userIdValue] } } }
          }
        },
        {
          $sort: {"userData.goldAmount": 1} // Sort userData array by amount in ascending order
        }
      ];

      try {
        const leaderBoard = await Bucket.aggregate(pipeline);
    
        if (leaderBoard.length > 0) {
            res.status(200).json(leaderBoard);
        } else {
            res.status(200).json('No matching document found.');
        }

      } catch (err) {
        res.json(err);
      }
}

async function claim(req, res) {
    
   //create buckets
}

module.exports = {
    getCurrentEvent,
    addReportedGoldAmount,
    getLeaderboard,
    claim
};