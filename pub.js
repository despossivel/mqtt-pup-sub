const Mqtt = require("./Mqtt.js");

const allowedSubTopics = ["request", "command"];

const allowedPubTopics = ["alive", "status", "error", "metrics", "response"];

const mqttClient = new Mqtt({
  host: "127.0.0.1",
  port: 1883,
  publishTopics: allowedPubTopics,
  subscribeTopics: allowedSubTopics,
});

mqttClient.connect();

let count = 0;
setInterval(() => {
  allowedPubTopics.forEach((topic) => {
    mqttClient.publish(
      topic,
      `Hello from publisher ${count} at ${new Date().toISOString()}`
    );
  });
  count++;
}, 500);

mqttClient.onMessage((topic, message) => {
  console.log(`Received message on ${topic}: ${message}`);
});
