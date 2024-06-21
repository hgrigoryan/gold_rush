const eventController = require('./eventController');

let isStarted = false;

async function startEvent() {
    try {
        console.log('Starting event...');
        await eventController('start');
        console.log('Event started successfully.');
        isStarted = true;
        // Schedule stop after 300 seconds (5 minutes)
        setTimeout(stopEvent, 900 * 1000);
    } catch (err) {
        console.error('Failed to start event:', err.message);
    }
}

async function stopEvent() {
    try {
        console.log('Stopping event...');
        await eventController('stop');
        console.log('Event stopped successfully.');
        isStarted = false;
        // Schedule start after 5 seconds
        setTimeout(startEvent, 5 * 1000);
    } catch (err) {
        console.error('Failed to stop event:', err.message);
    }
}

// Start the first event 5 seconds after the application starts
setTimeout(startEvent, 5 * 1000);