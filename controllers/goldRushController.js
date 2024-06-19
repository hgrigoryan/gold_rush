const Event = require("../schemas/event");
const User = require("../schemas/user");
const Bucket = require('../schemas/bucket');
const Errors = require("../utils/errors");

async function getCurrentEvent(req, res) {
    try {
        const currentEvent = await Event.findOne({state: 'started'});
        if(!currentEvent) {
            throw new Errors.NotFoundError;
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
  //if eventId is not current, the server has to ignore that data, and respond with rewards to any request
  //redirect to claim, give rewards to user
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    const goldAmount = req.params.gold_amount;

    const parsedGoldAmount = parseFloat(goldAmount);
    if(isNaN(parsedGoldAmount) || parsedGoldAmount <= 0) {
        return res.status(400).json('Invalid amount');
    }

    const event = await Event.findOne({id: eventId});
    if(!event){
        throw new Errors.NotFoundError;
    } else if(event.status === 'ended') {
        await claim();
        return;
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
              } else {
                //add user to bucket
              }
              
            }

        } else {
            const bucket = new Bucket(
              {
                  eventId,
                  userData: {
                      userId,
                      goldAmount: parsedGoldAmount,
                      type: req.accessToken.type
                  }
              }
            )
            }

    } catch(err) {
        res.json(err);
    }
}

async function getLeaderboard(req, res) {
    const userId = req.params.userId;
    const eventId = req.params.eventId;

    const event = await Event.findOne({id: eventId});
    if(!event){
      throw new Errors.NotFoundError;
    } else if(event.status === 'started') {
      throw new Errors.BadRequestError;
    }

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
          $sort: {"userData.goldAmount": -1} // Sort userData array by amount in ascending order
        }
      ];

      try {
        const leaderBoard = await Bucket.aggregate(pipeline);
    
        if (leaderBoard.length > 0) {
            //nedd to add ranking info
            res.status(200).json(leaderBoard);
        } else {
            res.status(200).json('No matching document found.');
        }

      } catch (err) {
        res.json(err);
      }
}

async function claim(req, res) {
    const userId = req.params.userId;
    const eventId = req.params.eventId;

    try {
      const event = await Event.findOne({id: eventId});
      if(!event){
        throw new Errors.NotFoundError;
      } else if(event.status === 'started') {
        throw new Errors.BadRequestError;
      }

      const userRank = (await Rank.findOne({eventId, userId})).rank;
      
      if(!userRank){
        throw new Errors.NotFoundError;
      }

      res.send(200).json({status: 'claim_complete', rank: userRank})

    } catch(err) {
      res.json(err);
    }
}

module.exports = {
    getCurrentEvent,
    addReportedGoldAmount,
    getLeaderboard,
    claim
};