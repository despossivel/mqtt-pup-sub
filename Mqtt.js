const path = require("path");
const fileName = path.basename(__filename);
const logger = require("./winston");
const mqtt = require("mqtt");

class Mqtt {
  #host;
  #port;
  #client;
  #options;

  #publishTopics;
  #subscribeTopics;

  constructor(parameters, authentication = {}) {
    this.#host = parameters.host || "localhost";
    this.#port = parameters.port || 1883;
    this.#options = {
      clean: true,
      connectTimeout: 4000,
      // Authentication
      ...authentication,
    };

    this.#publishTopics = parameters.publishTopics || allowedPubTopics;
    this.#subscribeTopics = parameters.subscribeTopics || allowedSubTopics;
  }

  connect() {
    if (this.#client) {
      console.warn("Client MQTT is already connected");
      return;
    }

    this.#client = mqtt.connect(
      `mqtt://${this.#host}:${this.#port}`,
      this.#options
    );

    this.#client.on("connect", this.connected.bind(this));
  }

  connected() {
    logger.info("✅ Connected to MQTT", { label: fileName });
    this.#subscribeTopics.forEach((topic) => this.subscribe(topic));

    this.onOffline(() => logger.info("✖️ Client MQTT is offline"));
    this.onError((err) => logger.error("✖️ Connection MQTT error:", err));
    this.onClose(() => logger.info("✖️ Connection MQTT closed"));
    this.onReconnect(() => logger.info("Reconnecting to MQTT broker"));
  }

  disconnect() {
    this.checkConnection();
    this.#client.end();
    this.#client = null;
    logger.info("✖️ Disconnected from MQTT broker");
  }

  checkConnection() {
    if (!this.#client) {
      logger.error("✖️ Client MQTT is not connected. Please connect first.");
      throw new Error("Client MQTT is not connected");
    }
  }

  publish(topic, message) {
    this.checkConnection();

    // topics to send from backoffice to device
    if (!this.#publishTopics.includes(topic)) {
      logger.error(
        `✖️ Invalid key in message: ${topic}. Allowed topics are: ${this.#publishTopics.join(
          ", "
        )}`
      );
      return;
    }

    this.#client.publish(topic, JSON.stringify(message), (err) => {
      if (err) {
        logger.error("✖️ Publish MQTT error:", err);
      } else {
        logger.info(`✅ Message MQTT published to ${topic}`);
      }
    });
  }

  subscribe(topic) {
    this.checkConnection();
    this.#client.subscribe(topic, (err) => {
      if (err) {
        logger.error("✖️ Subscription MQTT error:", err);
      } else {
        logger.info(`✅ Subscribed MQTT to ${topic}`);
      }
    });
  }

  onMessage(callback) {
    this.checkConnection();
    this.#client.on("message", (topic, message) => {
      try {
        if (!this.#subscribeTopics.includes(topic)) {
          logger.error(
            `✖️ Invalid topic: ${topic}. Allowed topics are: ${this.#subscribeTopics.join(
              ", "
            )}`
          );
          return;
        }

        callback(topic, JSON.parse(message.toString()));
      } catch (e) {
        logger.error("✖️ Error parsing MQTT message:", e);
      }
    });
  }

  unsubscribe(topic) {
    this.checkConnection();
    this.#client.unsubscribe(topic, (err) => {
      if (err) {
        logger.error("✖️ Unsubscribe MQTT error:", err);
      } else {
        logger.info(`✅ Unsubscribed MQTT from ${topic}`);
      }
    });
  }

  onError(callback) {
    this.#client.on("error", (err) => callback(err));
  }

  onClose(callback) {
    this.#client.on("close", () => callback());
  }

  onOffline(callback) {
    this.#client.on("offline", () => callback());
  }

  onReconnect(callback) {
    this.#client.on("reconnect", () => callback());
  }

  onEnd(callback) {
    this.#client.on("end", () => callback());
  }
}

module.exports = Mqtt;
