require('dotenv').config();
module.exports = {
  mongoURI: process.env.MONGODB_ORDER_URI || 'mongodb://localhost/orders',
  rabbitMQUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  rabbitMQQueue: process.env.RABBITMQ_ORDERS_QUEUE || 'orders',
  rabbitMQCallbackQueue: process.env.RABBITMQ_PRODUCTS_QUEUE || 'products',
  port: process.env.PORT || 3002
};