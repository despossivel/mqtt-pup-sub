# Simple Pub/Sub Example with MQTT Mosquitto

This project demonstrates a basic publish/subscribe (Pub/Sub) proof of concept using MQTT with the Mosquitto broker (via Docker) and Node.js clients.

## Prerequisites

- Node.js installed
- Docker and Docker Compose installed

## Starting the Mosquitto Broker

1. The `.docker/mosquitto.conf` file is already configured to accept external connections.
2. Start the broker with Docker Compose:

   ```bash
   docker compose -f docker-compose.mosquitto.yml up -d
   ```

## Installing Dependencies

In the project directory, run:

```bash
npm install mqtt winston
```

## Running the Clients

### Publisher

The publisher sends messages periodically to several topics.

```bash
node pub.js
```

### Subscriber

The subscriber listens for messages on the defined topics.

```bash
node sub.js
```

## File Structure

- `Mqtt.js`: Utility class for MQTT connection and management.
- `pub.js`: Publisher example.
- `sub.js`: Subscriber example.
- `.docker/mosquitto.conf`: Mosquitto configuration.
- `docker-compose.mosquitto.yml`: Compose file to start the broker.

## Notes

- Change the broker IP in `pub.js` and `sub.js` as needed for your network.
- Make sure port 1883 is open on your network.
- Allowed topics are defined in the `allowedPubTopics` and `allowedSubTopics` arrays.
