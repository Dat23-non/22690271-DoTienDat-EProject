## 1) Chuẩn bị hạ tầng
Tạo file docker-compose.yml:
```yaml
version: "3.9"
services:
  mongo:
    image: mongo:6
    ports: ["27017:27017"]
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
```
Chạy:
```bash
docker compose up -d
```
Truy cập RabbitMQ: [http://localhost:15672](http://localhost:15672)

## 2) Cấu hình ENV
**auth/.env**
```
MONGODB_AUTH_URI=mongodb://localhost:27017/auth
JWT_SECRET=supersecret
PORT=3000
```

**product/.env**
```
MONGODB_PRODUCT_URI=mongodb://localhost:27017/products
JWT_SECRET=supersecret
RABBITMQ_URL=amqp://localhost:5672
PORT=3001
```

**order/.env**
```
MONGODB_ORDER_URI=mongodb://localhost:27017/orders
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_ORDERS_QUEUE=orders
RABBITMQ_PRODUCTS_QUEUE=products
PORT=3002
```

## 3) Cài đặt & khởi chạy
```bash
cd order && npm install && npm start
cd ../product && npm install && npm start
cd ../auth && npm install && npm start
```

## 4) Kiểm thử với Postman
- Đăng ký: POST http://localhost:3000/register
- Đăng nhập: POST http://localhost:3000/login
- Tạo sản phẩm: POST http://localhost:3001/products
- Mua hàng: POST http://localhost:3001/products/buy

