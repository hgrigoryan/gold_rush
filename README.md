# gold_rush
“Gold Rush” is an in game event that begins at a specified time and concludes after a designated period. During that period players are added into so-called temporary buckets of 200 people, where they compete together for rewards. Players collect gold by tapping on gold nuggets in the game.  
Endpoints to support: event, report, leaderboard, claim 

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

## Introduction

Application starts an event and stops it after 5 minutes (this duration can be changed). It saves the ranking information for the event and starts a new event. 
Users can register/login and receive an authorization token, which they will use for further access to game endpoints.
There are four game endpoints: event, report, leaderboard, and claim. 
Users can get current event info by calling the event endpoint. 
They can report their collected gold amounts by calling the report endpoint. If a user is reporting for the first time, they will be added to the corresponding event bucket. If a user wants to report but the event has finished, they will be redirected to the claim endpoint handler and will receive their reward for the ended event. They can do this only once. There is also a leaderboard endpoint that will return the leaderboard formed from the same bucket's users ranking data that the user is in. 
Users can also call the claim endpoint to receive their rewards if they haven't done so yet.

## Features

- User authentication and authorization
- Data validation
- CRUD operations
- Scheduling events

## Technologies

- Node.js
- Express
- Mongoose
- MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hgrigoryan/gold_rush
   cd gold_rush
   npm install

   Create a .env file in the root of the project.
   Add ACCESS_TOKEN_SECRET in .env file.

   Run the project
   npm start

## API Endpoints

Gold Rush endpoints
GET /event/:userId - returns current event info
POST /report/:userId/:eventId/:gold_amount - adds user gold amount or redirect to claim if event is ended
GET /leaderboard/:userId/:eventId - returns current event leaderboard data, for users that are in the same group with requesting user
PATCH /claim/:userId/:eventId - returns users reward: ranking information for user

Auth endpoints
POST /register - registers new user
POST /login" - log in user
GET /logout - log out user

## Database Schema

Users must provide unique email, unique name, password and type by registering. 
All these fields are required.

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique : true, 
        required : true, 
        index: true
    },
    name: {
        type: String,
        unique : true,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    type: {
        type: String,
        enum: ['fish', 'dolphin', 'whale'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

Event has state, startDate and endDate. End date calculated by adding to start date an event duration(which must be moved to config file by the way :)

const eventSchema = new mongoose.Schema({
    state: {
        type: String,
        enum: ['started', 'ended'],
        default: 'started',
        index: true,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: function() {
            return new Date(this.startDate.getTime() + 300 * 1000); // 300 seconds after start
        }
    }
})

Bucket schema includes it's eventId, typesCount counter, that helps to add new users in correct bucket and userData array. userData array holds userId and user's total gold amount, collected during event.

const bucketSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    typesCount: {
      fish: {
        type: Number,
        min: 0,
        max: 150,
        default: 0
      },
      dolphin: {
        type: Number,
        min: 0,
        max: 40,
        default: 0
      },
      whale: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
      }
    },
    usersData: {
        type: [
          {
            userId: {
              type: Schema.Types.ObjectId,
              required: true,
              index: true
            },
            goldAmount: {
              type: Number,
              default: 0
            },
          }
        ],
        validate: {
          validator: function(val) {
            return val.length <= 200;
          },
          message: 'The users array exceeds the limit of 200.'
        }
      },
    cratedAt: {
      type: Date,
      default: Date.now
    },
})

Rank contains it's eventId, userId, rank that user acheaved during that event and claimComplete flag which helps to be shure that user can claim his reward only once.

const RankSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    rank: {
        type: Number,
        min: 0,
        max: 199
    },
    claimComplete: {
        type: Boolean,
        default: false
    },
    cratedAt: {
        type: Date,
        default: Date.now
    },
})

