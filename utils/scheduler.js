const cron = require('node-cron');
const eventController = require('./eventController');

const START_INTERVAL = '*/305 * * * * *'; // Every 305 seconds
const STOP_INTERVAL = '*/300 * * * * *'; // Every 300 seconds

let isStarted = false;

async function startEvent() {
  try {
    console.log('Starting event...');
    await eventController('start');
    console.log('Event started successfully.');
    isStarted = true;
  } catch (error) {
    console.error('Failed to start event:', error.message);
  }
}

async function stopEvent() {
  try {
    console.log('Stopping event...');
    await eventController('stop');
    console.log('Event stopped successfully.');
    isStarted = false;
  } catch (error) {
    console.error('Failed to stop event:', error.message);
  }
}

cron.schedule(START_INTERVAL, async () => {
  if (!isStarted) {
    await startEvent();
  }
});

cron.schedule(STOP_INTERVAL, async () => {
  if (isStarted) {
    await stopEvent();
  }
});

module.exports = startEvent;