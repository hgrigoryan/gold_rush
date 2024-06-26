const Event = require("../schemas/event");
const Rank = require("../schemas/rank");
const Bucket = require('../schemas/bucket');
const {NotFoundError, BadRequestError} = require("../utils/errors");

async function getCurrentEvent(req, res) {
    try {
        const currentEvent = await Event.findOne({state: 'started'});
        if(!currentEvent) {
            throw new NotFoundError;
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
    const userType = req.accessToken.type;

    try {
        const parsedGoldAmount = parseFloat(goldAmount);
        if(isNaN(parsedGoldAmount) || parsedGoldAmount <= 0) {
            throw new BadRequestError;
        }

        const event = await Event.findOne({_id: eventId});
        
        if(!event){
            throw new NotFoundError;
        } else if(event.state === 'ended') {
            //redirect to claim, return rank to user
            await claim(req, res);
            return;
        }

        const eventBuckets = await Bucket.find({eventId});
        if(eventBuckets.length > 0) {  
            //if user is in one of event's buckets add user's goldAmount  
            for(const bucket of eventBuckets) {
                const userDataIndex = bucket.usersData.findIndex(userData => userData.userId.toString() === userId);
  
                if(userDataIndex !== -1) {
                  bucket.usersData[userDataIndex].goldAmount += parsedGoldAmount;
                  await bucket.save();
                  res.status(200).json({message: 'User data updated successfully.'});
                  return;
                }
            }
            //if user is not found in event's buckets, add user into corresponding bucket
            // must be moved to config.js
            const MAX_COUNT = {
                fish: 150,
                dolphin: 40,
                whale: 10
            };
            
            for(const bucket of eventBuckets) {
                if (bucket.typesCount[userType] < MAX_COUNT[userType]){
                    bucket.usersData.push({userId, goldAmount: parsedGoldAmount});
                    bucket.typesCount[userType]++;
                    await bucket.save();
                    res.status(200).json({message: 'User added.'});
                    return;
                }
            }
            //if there is no plase in buckets for this type of user, add bucket, add user into it
            const bucket = new Bucket({
              eventId,
              usersData : {
                  userId,
                  goldAmount: parsedGoldAmount
              }
            });
            bucket.typesCount[userType]++;
            await bucket.save();
            res.status(200).json({message: 'New bucket added, user added.'});
            return;
        } else {
              //if there is no buckets for this event
              const bucket = new Bucket({
                    eventId,
                    usersData : [
                        {
                            userId,
                            goldAmount: parsedGoldAmount
                        }
                    ]
              });
              bucket.typesCount[userType]++;
              await bucket.save();
              res.status(200).json({message: 'First bucket added, user added.'});
          }
    } catch(err) {
        res.json(err);
    }
}

async function getLeaderboard(req, res) {
    const userId = req.params.userId;
    const eventId = req.params.eventId;

    try {
        const event = await Event.findOne({_id: eventId});

        if(!event) {
            throw new NotFoundError;
        } else if(event.state === 'ended') {
            throw new BadRequestError;
        }

        const bucket = await Bucket.findOne({
            eventId,
            'usersData.userId': userId
        });

        if(bucket) {
            const leaderBoard = bucket.usersData
              .sort((a, b) => b.goldAmount - a.goldAmount)
              .map((userData, index) => ({
                ...userData.toObject(),
                rank: 199 - index
              }));
            res.status(200).json(leaderBoard);
        } else {
            res.status(200).json('No matching document found.');
        } 
      } catch(err) {
          res.json(err);
      }
}

async function claim(req, res) {
    const userId = req.params.userId;
    const eventId = req.params.eventId;

    try {
        const event = await Event.findOne({_id: eventId});
        if(!event) {
            throw new NotFoundError;
        } else if(event.state === 'started') {
            throw new BadRequestError;
        }

        const userRank = await Rank.findOne({eventId, userId});

        if(!userRank) {
            throw new NotFoundError;
        }
        if(userRank.claimComplete) {
            throw new BadRequestError;
        }

        res.status(200).json({status: 'claim_complete', rank: userRank.rank});
        res.on('finish', async () => {
          if (res.statusCode === 200) {
              userRank.claimComplete = true;
              try {
                  await userRank.save();
              } catch(err) {
                  console.error('Failed to update user rank:', err);
              }
          }
        });

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