# Lab 003: Debugging Complex Issues

## Learning Objectives

By the end of this lab, you will be able to:
- Use Claude to systematically debug complex technical issues
- Analyze stack traces and error logs effectively
- Debug asynchronous and concurrent code
- Identify root causes in multi-component systems
- Create reproducible test cases for bugs
- Implement defensive programming practices
- Use debugging tools and techniques efficiently

## Prerequisites

- Completion of Lab 001 and Lab 002
- Understanding of async/await, promises, callbacks
- Familiarity with debugging tools (debugger, logging, profiling)
- Knowledge of common bug patterns
- 75-90 minutes to complete the lab

## Setup

1. Create a lab directory:
```bash
mkdir claude-lab-003-debugging
cd claude-lab-003-debugging
npm init -y
npm install express mongoose redis ioredis axios
```

2. Prepare debugging tools:
   - Node.js debugger
   - Logging library (winston or pino)
   - Monitoring tools (optional)

3. Open Claude in a new conversation

## Exercise 1: Stack Trace Analysis (15 minutes)

### Objective
Learn to analyze and interpret complex stack traces using Claude.

### Instructions

**Step 1: Analyze a Cryptic Stack Trace**

Here's a real-world error from a production system:

```
UnhandledPromiseRejectionWarning: Error: Connection timeout
    at Timeout._onTimeout (/app/node_modules/mongoose/lib/drivers/node-mongodb-native/connection.js:314:20)
    at listOnTimeout (internal/timers.js:549:17)
    at processTimers (internal/timers.js:492:7)
(node:1) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().
(node:1) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

**Prompt for Claude**:

```
Analyze this stack trace and help me debug the issue:

[Paste stack trace above]

Please provide:
1. What is the root cause of this error?
2. Which part of my code is likely responsible?
3. What are the potential reasons for this specific error?
4. How can I locate the exact source in my code?
5. What is the immediate fix?
6. What is the long-term solution to prevent this?
7. How do I properly handle this error case?

Context:
- Node.js application using Express and Mongoose
- Deployed in Docker containers
- Error occurs intermittently under high load
- MongoDB is running on a separate container
```

**Step 2: Deep Dive with Code Context**

Provide Claude with relevant code:

```javascript
// app.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

app.listen(3000);
```

**Updated Prompt**:

```
Here's my application code that's causing the stack trace:

[Paste code above]

Given this code and the previous stack trace:
1. Identify the specific line(s) causing the issue
2. Explain why the error manifests as "Connection timeout"
3. Show me the corrected code with proper error handling
4. Add appropriate logging to diagnose future issues
5. Include retry logic for transient failures
```

**Validation Checkpoint**:

Claude should identify:
- Missing connection options (timeout settings)
- No error handling for database operations
- Unhandled promise rejections
- Missing connection event listeners
- Need for graceful shutdown

**Step 3: Implement the Fix**

```javascript
// app.js (Fixed)
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger');

const app = express();

// Mongoose connection with proper configuration
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    // Exit process with failure
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

connectDB();

// Route with error handling
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    logger.error('Error fetching user:', {
      userId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'An error occurred while fetching the user' 
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await mongoose.connection.close();
  process.exit(0);
});

const server = app.listen(3000, () => {
  logger.info('Server started on port 3000');
});

module.exports = { app, server };
```

### Solution

**Root Cause**: Unhandled promise rejection from failed MongoDB connection.

**Fixes Applied**:
1. Added connection timeout settings
2. Implemented proper error handling
3. Added connection event listeners
4. Implemented graceful shutdown
5. Added comprehensive logging

### Key Takeaways
- Stack traces often point to symptoms, not root causes
- Context is critical for accurate diagnosis
- Always handle promises properly
- Connection management needs event listeners
- Logging helps diagnose production issues

## Exercise 2: Race Conditions and Async Bugs (20 minutes)

### Objective
Debug complex async issues that appear intermittently.

### Instructions

**Step 1: Identify the Race Condition**

Here's buggy code that works sometimes:

```javascript
// orderService.js
class OrderService {
  constructor(db, inventoryService, paymentService) {
    this.db = db;
    this.inventoryService = inventoryService;
    this.paymentService = paymentService;
  }
  
  async createOrder(userId, items) {
    // Check inventory
    for (const item of items) {
      const available = await this.inventoryService.checkStock(item.productId);
      if (available < item.quantity) {
        throw new Error(`Insufficient stock for ${item.productId}`);
      }
    }
    
    // Calculate total
    let total = 0;
    for (const item of items) {
      const product = await this.db.products.findById(item.productId);
      total += product.price * item.quantity;
    }
    
    // Process payment
    const payment = await this.paymentService.charge(userId, total);
    
    // Deduct inventory
    for (const item of items) {
      await this.inventoryService.deduct(item.productId, item.quantity);
    }
    
    // Create order
    const order = await this.db.orders.create({
      userId,
      items,
      total,
      paymentId: payment.id,
      status: 'completed'
    });
    
    return order;
  }
}
```

**Bug Report**:
```
Issue: Customers occasionally charged but inventory not deducted, 
       or inventory deducted but payment failed.

Frequency: ~1 in 50 orders during peak traffic

Impact: Overselling inventory, customer complaints, revenue loss

Reproduction: Difficult to reproduce in development, 
             only occurs in production under load
```

**Prompt for Claude**:

```
I have a race condition bug in this order processing code:

[Paste code and bug report above]

Please:
1. Identify all potential race conditions
2. Explain scenarios where each could occur
3. Show the failure modes (what goes wrong)
4. Provide a corrected implementation with:
   - Proper transaction handling
   - Rollback on failures
   - Idempotency
   - Concurrency control
5. Explain how to test for race conditions
6. Add appropriate logging for debugging

The system uses:
- PostgreSQL database
- Redis for caching
- Stripe for payments
- Microservices architecture
```

**Step 2: Analyze Claude's Response**

Claude should identify issues like:
1. Time-of-check to time-of-use (TOCTOU) vulnerability
2. No atomicity across operations
3. Partial failure scenarios
4. No idempotency
5. No distributed locks
6. Sequential operations that should be parallel

**Step 3: Implement Corrected Version**

```javascript
// orderService.js (Fixed)
class OrderService {
  constructor(db, inventoryService, paymentService, redisClient, logger) {
    this.db = db;
    this.inventoryService = inventoryService;
    this.paymentService = paymentService;
    this.redisClient = redisClient;
    this.logger = logger;
  }
  
  async createOrder(userId, items, idempotencyKey) {
    const lockKey = `order:lock:${userId}`;
    const lock = await this.acquireLock(lockKey, 30000); // 30 second lock
    
    if (!lock) {
      throw new Error('Another order is being processed for this user');
    }
    
    try {
      // Check for duplicate request (idempotency)
      const existingOrder = await this.checkIdempotency(idempotencyKey);
      if (existingOrder) {
        this.logger.info('Returning existing order for idempotency key', { 
          idempotencyKey 
        });
        return existingOrder;
      }
      
      // Start database transaction
      const transaction = await this.db.sequelize.transaction({
        isolationLevel: this.db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
      });
      
      try {
        // Reserve inventory atomically within transaction
        const reservations = await this.reserveInventory(items, transaction);
        
        // Calculate total with locked prices
        const total = reservations.reduce((sum, res) => {
          return sum + (res.price * res.quantity);
        }, 0);
        
        // Create order record in pending state
        const order = await this.db.orders.create({
          userId,
          items: reservations.map(r => ({
            productId: r.productId,
            quantity: r.quantity,
            price: r.price
          })),
          total,
          status: 'pending',
          idempotencyKey
        }, { transaction });
        
        // Commit transaction to reserve inventory
        await transaction.commit();
        
        // Process payment (external, non-transactional)
        let payment;
        try {
          payment = await this.paymentService.charge(userId, total, {
            orderId: order.id,
            idempotencyKey: `payment:${idempotencyKey}`
          });
        } catch (paymentError) {
          // Payment failed - rollback inventory reservation
          await this.rollbackInventoryReservation(order.id);
          await this.updateOrderStatus(order.id, 'payment_failed');
          
          this.logger.error('Payment failed, inventory rolled back', {
            orderId: order.id,
            error: paymentError.message
          });
          
          throw new Error('Payment processing failed');
        }
        
        // Update order with payment info
        await this.updateOrderWithPayment(order.id, payment.id);
        
        this.logger.info('Order created successfully', {
          orderId: order.id,
          userId,
          total
        });
        
        return order;
        
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
      
    } finally {
      await this.releaseLock(lockKey, lock);
    }
  }
  
  async reserveInventory(items, transaction) {
    const reservations = [];
    
    for (const item of items) {
      // Lock the row with FOR UPDATE
      const product = await this.db.products.findOne({
        where: { id: item.productId },
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. ` +
          `Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }
      
      // Deduct inventory
      await product.decrement('stock', {
        by: item.quantity,
        transaction
      });
      
      reservations.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    return reservations;
  }
  
  async acquireLock(key, ttlMs) {
    const lockValue = `${Date.now()}-${Math.random()}`;
    const result = await this.redisClient.set(
      key,
      lockValue,
      'PX',
      ttlMs,
      'NX'
    );
    
    return result === 'OK' ? lockValue : null;
  }
  
  async releaseLock(key, lockValue) {
    // Lua script for atomic check-and-delete
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    
    await this.redisClient.eval(script, 1, key, lockValue);
  }
  
  async checkIdempotency(key) {
    if (!key) return null;
    
    return await this.db.orders.findOne({
      where: { idempotencyKey: key }
    });
  }
  
  async rollbackInventoryReservation(orderId) {
    const order = await this.db.orders.findByPk(orderId);
    
    const transaction = await this.db.sequelize.transaction();
    
    try {
      for (const item of order.items) {
        const product = await this.db.products.findByPk(
          item.productId,
          { transaction }
        );
        
        await product.increment('stock', {
          by: item.quantity,
          transaction
        });
      }
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  async updateOrderStatus(orderId, status) {
    await this.db.orders.update(
      { status },
      { where: { id: orderId } }
    );
  }
  
  async updateOrderWithPayment(orderId, paymentId) {
    await this.db.orders.update(
      { 
        paymentId,
        status: 'completed'
      },
      { where: { id: orderId } }
    );
  }
}

module.exports = { OrderService };
```

**Step 4: Create Tests for Race Conditions**

```javascript
// orderService.test.js
const { OrderService } = require('./orderService');

describe('OrderService - Race Conditions', () => {
  describe('concurrent order creation', () => {
    it('should handle concurrent orders for same product without overselling', async () => {
      // Setup: Product with stock of 10
      const productId = 'product-123';
      await db.products.create({
        id: productId,
        name: 'Test Product',
        price: 100,
        stock: 10
      });
      
      // Create 5 concurrent orders, each requesting 3 items
      const orderPromises = Array(5).fill(null).map((_, index) => 
        orderService.createOrder(
          `user-${index}`,
          [{ productId, quantity: 3 }],
          `idempotency-key-${index}`
        )
      );
      
      // Execute all concurrently
      const results = await Promise.allSettled(orderPromises);
      
      // Verify: Only 3 orders should succeed (3 * 3 = 9, leaving 1 in stock)
      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');
      
      expect(successful.length).toBe(3);
      expect(failed.length).toBe(2);
      
      // Verify final stock
      const product = await db.products.findByPk(productId);
      expect(product.stock).toBe(1);
    });
    
    it('should rollback inventory if payment fails', async () => {
      const productId = 'product-456';
      await db.products.create({
        id: productId,
        stock: 100
      });
      
      // Mock payment service to fail
      paymentService.charge = jest.fn().mockRejectedValue(
        new Error('Payment declined')
      );
      
      // Attempt order
      await expect(
        orderService.createOrder(
          'user-1',
          [{ productId, quantity: 5 }],
          'idempotency-key-1'
        )
      ).rejects.toThrow('Payment processing failed');
      
      // Verify inventory was rolled back
      const product = await db.products.findByPk(productId);
      expect(product.stock).toBe(100); // Back to original
    });
    
    it('should handle duplicate requests with same idempotency key', async () => {
      const productId = 'product-789';
      const idempotencyKey = 'unique-key-123';
      
      await db.products.create({
        id: productId,
        stock: 100
      });
      
      // Create two identical requests
      const [order1, order2] = await Promise.all([
        orderService.createOrder(
          'user-1',
          [{ productId, quantity: 5 }],
          idempotencyKey
        ),
        orderService.createOrder(
          'user-1',
          [{ productId, quantity: 5 }],
          idempotencyKey
        )
      ]);
      
      // Both should return the same order
      expect(order1.id).toBe(order2.id);
      
      // Only one order should be created
      const orders = await db.orders.count({
        where: { idempotencyKey }
      });
      expect(orders).toBe(1);
      
      // Stock should only be deducted once
      const product = await db.products.findByPk(productId);
      expect(product.stock).toBe(95);
    });
  });
});
```

**Validation Checkpoint**:
- [ ] Transactions ensure atomicity
- [ ] Distributed locks prevent concurrent modifications
- [ ] Idempotency prevents duplicate orders
- [ ] Rollback logic handles failures
- [ ] Tests verify concurrent behavior

### Solution

**Root Causes Fixed**:
1. TOCTOU race condition eliminated with database locks
2. Atomicity guaranteed with transactions
3. Partial failures handled with rollback
4. Duplicate requests prevented with idempotency
5. Concurrent access controlled with distributed locks

### Key Takeaways
- Race conditions often require load testing to reproduce
- Database transactions are critical for consistency
- Idempotency prevents duplicate operations
- Distributed locks coordinate concurrent operations
- Always test concurrent scenarios explicitly

## Exercise 3: Memory Leaks and Performance Issues (20 minutes)

### Objective
Debug memory leaks and performance degradation using systematic analysis.

### Instructions

**Step 1: Analyze Performance Symptoms**

**Problem Report**:
```
Application: Real-time chat service
Symptom: Memory usage grows continuously, server crashes after 6-8 hours
Observation: Response times increase over time (starts at 50ms, reaches 2000ms)
Environment: Node.js, Socket.io, Redis pub/sub
```

**Problematic Code**:

```javascript
// chatServer.js
const io = require('socket.io')(server);
const redis = require('redis');

const userSockets = new Map();
const messageHistory = [];

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  
  // Store socket reference
  userSockets.set(userId, socket);
  
  // Subscribe to user's channels
  const subscriber = redis.createClient();
  subscriber.subscribe(`user:${userId}:messages`);
  
  subscriber.on('message', (channel, message) => {
    socket.emit('message', JSON.parse(message));
    messageHistory.push({
      userId,
      message: JSON.parse(message),
      timestamp: new Date()
    });
  });
  
  socket.on('send_message', async (data) => {
    const publisher = redis.createClient();
    await publisher.publish(
      `user:${data.recipientId}:messages`,
      JSON.stringify({
        from: userId,
        content: data.content,
        timestamp: new Date()
      })
    );
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', userId);
  });
  
  // Load message history on connect
  socket.emit('history', messageHistory.filter(m => 
    m.userId === userId || m.message.from === userId
  ));
});

setInterval(() => {
  console.log('Active users:', userSockets.size);
  console.log('Message history size:', messageHistory.length);
}, 60000);
```

**Prompt for Claude**:

```
This chat server has a memory leak. Memory grows unbounded until crash.

[Paste code above]

Please:
1. Identify all memory leak sources
2. Explain why each causes a leak
3. Calculate the memory growth rate
4. Show how to diagnose this with profiling tools
5. Provide corrected code with:
   - Proper cleanup
   - Bounded memory usage
   - Connection pooling
   - Efficient data structures
6. Add monitoring to detect future leaks
```

**Step 2: Analyze and Fix**

**Claude's Identified Issues**:

1. **Redis clients never closed**: New client created for each message
2. **Message history unbounded**: Array grows forever
3. **Socket references not cleaned**: Map never cleaned on disconnect
4. **Event listeners not removed**: Subscriber keeps listening after disconnect
5. **No pagination for history**: Sends entire history each time

**Corrected Implementation**:

```javascript
// chatServer.js (Fixed)
const io = require('socket.io')(server);
const Redis = require('ioredis');
const logger = require('./logger');

// Shared Redis clients (connection pooling)
const publisher = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

const subscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// Use WeakMap for automatic garbage collection
const userSockets = new Map();

// Use Redis for message history (bounded, persistent)
const MESSAGE_HISTORY_TTL = 7 * 24 * 60 * 60; // 7 days
const MESSAGE_HISTORY_LIMIT = 1000;

class ChatServer {
  constructor() {
    this.setupSocketIO();
    this.setupMonitoring();
  }
  
  setupSocketIO() {
    io.on('connection', (socket) => {
      this.handleConnection(socket);
    });
  }
  
  async handleConnection(socket) {
    const userId = socket.handshake.query.userId;
    
    if (!userId) {
      socket.disconnect();
      return;
    }
    
    logger.info('User connected', { userId, socketId: socket.id });
    
    // Store socket reference
    userSockets.set(userId, socket);
    
    // Subscribe to user's channel (reuse subscriber)
    const channel = `user:${userId}:messages`;
    await subscriber.subscribe(channel);
    
    // Handler for incoming messages
    const messageHandler = (receivedChannel, message) => {
      if (receivedChannel === channel) {
        try {
          socket.emit('message', JSON.parse(message));
        } catch (error) {
          logger.error('Error parsing message', { error, message });
        }
      }
    };
    
    subscriber.on('message', messageHandler);
    
    // Handle outgoing messages
    socket.on('send_message', async (data) => {
      try {
        await this.sendMessage(userId, data);
      } catch (error) {
        logger.error('Error sending message', { userId, error });
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Load paginated history
    socket.on('load_history', async (options = {}) => {
      try {
        const history = await this.getMessageHistory(userId, options);
        socket.emit('history', history);
      } catch (error) {
        logger.error('Error loading history', { userId, error });
      }
    });
    
    // Cleanup on disconnect
    socket.on('disconnect', async () => {
      logger.info('User disconnected', { userId, socketId: socket.id });
      
      // Remove socket reference
      userSockets.delete(userId);
      
      // Unsubscribe from channel
      await subscriber.unsubscribe(channel);
      
      // Remove message handler
      subscriber.off('message', messageHandler);
    });
    
    // Send initial history (limited)
    const initialHistory = await this.getMessageHistory(userId, { 
      limit: 50 
    });
    socket.emit('history', initialHistory);
  }
  
  async sendMessage(fromUserId, data) {
    const { recipientId, content } = data;
    
    const message = {
      from: fromUserId,
      content,
      timestamp: Date.now()
    };
    
    // Publish to recipient's channel
    await publisher.publish(
      `user:${recipientId}:messages`,
      JSON.stringify(message)
    );
    
    // Store in message history (Redis sorted set)
    await this.storeMessage(fromUserId, recipientId, message);
  }
  
  async storeMessage(fromUserId, toUserId, message) {
    const pipeline = publisher.pipeline();
    
    // Store for sender
    const senderKey = `history:${fromUserId}`;
    pipeline.zadd(senderKey, message.timestamp, JSON.stringify(message));
    pipeline.zremrangebyrank(senderKey, 0, -MESSAGE_HISTORY_LIMIT - 1);
    pipeline.expire(senderKey, MESSAGE_HISTORY_TTL);
    
    // Store for recipient
    const recipientKey = `history:${toUserId}`;
    pipeline.zadd(recipientKey, message.timestamp, JSON.stringify(message));
    pipeline.zremrangebyrank(recipientKey, 0, -MESSAGE_HISTORY_LIMIT - 1);
    pipeline.expire(recipientKey, MESSAGE_HISTORY_TTL);
    
    await pipeline.exec();
  }
  
  async getMessageHistory(userId, options = {}) {
    const { limit = 50, offset = 0 } = options;
    const key = `history:${userId}`;
    
    // Get messages in reverse chronological order
    const messages = await publisher.zrevrange(
      key,
      offset,
      offset + limit - 1
    );
    
    return messages.map(msg => JSON.parse(msg));
  }
  
  setupMonitoring() {
    setInterval(() => {
      const metrics = {
        activeConnections: userSockets.size,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      };
      
      logger.info('Server metrics', metrics);
      
      // Alert if memory usage is high
      const heapUsedMB = metrics.memoryUsage.heapUsed / 1024 / 1024;
      if (heapUsedMB > 500) {
        logger.warn('High memory usage detected', { heapUsedMB });
      }
    }, 60000);
  }
  
  async shutdown() {
    logger.info('Shutting down chat server');
    
    // Close all socket connections
    for (const [userId, socket] of userSockets) {
      socket.disconnect(true);
    }
    
    // Close Redis connections
    await publisher.quit();
    await subscriber.quit();
    
    logger.info('Chat server shutdown complete');
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await chatServer.shutdown();
  process.exit(0);
});

const chatServer = new ChatServer();

module.exports = chatServer;
```

**Step 3: Profile and Measure**

Create a profiling script:

```javascript
// profile.js
const v8Profiler = require('v8-profiler-next');
const fs = require('fs');

// Take heap snapshot
function takeHeapSnapshot(filename) {
  const snapshot = v8Profiler.takeSnapshot();
  
  snapshot.export((error, result) => {
    fs.writeFileSync(filename, result);
    snapshot.delete();
    console.log(`Heap snapshot saved to ${filename}`);
  });
}

// Monitor memory over time
function monitorMemory(intervalMs = 10000) {
  setInterval(() => {
    const usage = process.memoryUsage();
    console.log({
      timestamp: new Date().toISOString(),
      heapUsedMB: (usage.heapUsed / 1024 / 1024).toFixed(2),
      heapTotalMB: (usage.heapTotal / 1024 / 1024).toFixed(2),
      externalMB: (usage.external / 1024 / 1024).toFixed(2),
      rssMB: (usage.rss / 1024 / 1024).toFixed(2)
    });
  }, intervalMs);
}

// Compare snapshots
function compareSnapshots(before, after) {
  // Use Chrome DevTools to compare .heapsnapshot files
  console.log('Take snapshots before and after load test:');
  console.log('1. Load in Chrome DevTools > Memory > Load snapshot');
  console.log('2. Compare to identify memory growth');
}

module.exports = {
  takeHeapSnapshot,
  monitorMemory,
  compareSnapshots
};
```

**Usage**:
```javascript
// In your application startup
const profiler = require('./profile');

// Take snapshot before load test
profiler.takeHeapSnapshot('before-load.heapsnapshot');

// Monitor memory continuously
profiler.monitorMemory(10000);

// After load test
setTimeout(() => {
  profiler.takeHeapSnapshot('after-load.heapsnapshot');
}, 300000); // 5 minutes
```

**Validation Checkpoint**:
- [ ] Memory usage remains bounded over time
- [ ] No Redis connections leak
- [ ] Socket references cleaned up on disconnect
- [ ] Message history has size limit
- [ ] Monitoring alerts on abnormal usage

### Solution

**Memory Leaks Fixed**:
1. Connection pooling for Redis (reuse connections)
2. Bounded message history (Redis sorted sets with limits)
3. Proper cleanup on disconnect (remove all references)
4. Event listener removal (prevent accumulation)
5. Monitoring and alerting for early detection

### Key Takeaways
- Memory leaks often accumulate slowly
- Profile production-like workloads
- Cleanup is as important as setup
- Bounded data structures prevent unbounded growth
- Monitor memory metrics continuously

## Exercise 4: Multi-Service Debugging (15 minutes)

### Objective
Debug issues spanning multiple services with distributed traces.

### Instructions

**Step 1: Analyze Distributed System Issue**

**Problem**:
```
Symptom: User login sometimes returns 500 error
Services involved: API Gateway → Auth Service → User Service → Database
Frequency: ~5% of requests
Error message: "Internal server error"
Logs: Inconsistent across services
```

**Prompt for Claude**:

```
I have an intermittent failure in a microservices system:

Architecture:
1. API Gateway (Node.js/Express)
2. Auth Service (validates credentials, generates JWT)
3. User Service (retrieves user data)
4. PostgreSQL database

Problem:
- 5% of login requests fail with 500 error
- Error appears in different services randomly
- No clear pattern in logs
- Happens more during peak traffic

Logs from different services:

API Gateway:
[ERROR] 2026-05-05T10:23:45Z - POST /api/login - 500 - 2341ms

Auth Service:
[INFO] 2026-05-05T10:23:45Z - Validating credentials for user@example.com
[ERROR] 2026-05-05T10:23:47Z - Timeout calling user service

User Service:
[INFO] 2026-05-05T10:23:46Z - Fetching user data
[WARN] 2026-05-05T10:23:47Z - Slow query detected: 2000ms

Database:
(no errors, but connection pool near max)

Help me:
1. Correlate these logs to understand the request flow
2. Identify the root cause
3. Design a solution with proper timeout handling
4. Add distributed tracing
5. Implement circuit breakers
6. Add correlation IDs for debugging
```

**Step 2: Implement Correlation and Tracing**

```javascript
// middleware/correlation.js
const { v4: uuidv4 } = require('uuid');

function correlationMiddleware(req, res, next) {
  // Get or generate correlation ID
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();
  
  // Add to response headers
  res.setHeader('x-correlation-id', req.correlationId);
  
  // Add to logger context
  req.logger = logger.child({ correlationId: req.correlationId });
  
  next();
}

module.exports = { correlationMiddleware };
```

```javascript
// services/authService.js (with circuit breaker)
const CircuitBreaker = require('opossum');

class AuthService {
  constructor(userService, logger) {
    this.userService = userService;
    this.logger = logger;
    
    // Circuit breaker for user service calls
    this.userServiceBreaker = new CircuitBreaker(
      async (userId, correlationId) => {
        return await this.userService.getUser(userId, correlationId);
      },
      {
        timeout: 3000, // 3 second timeout
        errorThresholdPercentage: 50,
        resetTimeout: 30000 // Try again after 30 seconds
      }
    );
    
    this.userServiceBreaker.on('open', () => {
      this.logger.warn('User service circuit breaker opened');
    });
    
    this.userServiceBreaker.on('halfOpen', () => {
      this.logger.info('User service circuit breaker half-open');
    });
  }
  
  async login(email, password, correlationId) {
    const startTime = Date.now();
    
    try {
      this.logger.info('Login attempt started', { 
        email, 
        correlationId 
      });
      
      // Validate credentials
      const user = await this.validateCredentials(email, password, correlationId);
      
      if (!user) {
        this.logger.warn('Invalid credentials', { email, correlationId });
        return { success: false, error: 'Invalid credentials' };
      }
      
      // Fetch full user data with circuit breaker
      let userData;
      try {
        userData = await this.userServiceBreaker.fire(user.id, correlationId);
      } catch (error) {
        // Circuit breaker open or timeout
        if (error.message.includes('circuit breaker')) {
          this.logger.error('User service unavailable', { 
            correlationId, 
            error: error.message 
          });
          
          // Fallback: use cached data or minimal user data
          userData = { id: user.id, email: user.email };
        } else {
          throw error;
        }
      }
      
      // Generate JWT
      const token = await this.generateToken(userData);
      
      const duration = Date.now() - startTime;
      this.logger.info('Login successful', { 
        email, 
        correlationId, 
        duration 
      });
      
      return { 
        success: true, 
        token, 
        user: userData 
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Login failed', { 
        email, 
        correlationId, 
        duration, 
        error: error.message,
        stack: error.stack
      });
      
      throw error;
    }
  }
}
```

**Step 3: Add Distributed Tracing**

```javascript
// tracing.js
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

function setupTracing(serviceName) {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });
  
  const exporter = new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT,
  });
  
  provider.addSpanProcessor(new BatchSpanProcessor(exporter));
  provider.register();
  
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
    ],
  });
  
  return provider;
}

module.exports = { setupTracing };
```

**Validation Checkpoint**:
- [ ] Correlation IDs flow through all services
- [ ] Logs can be traced across services
- [ ] Circuit breakers prevent cascade failures
- [ ] Timeouts prevent hanging requests
- [ ] Distributed tracing visualizes request flow

### Solution

**Root Cause**: Connection pool exhaustion in User Service causing timeouts, which cascade to Auth Service and API Gateway.

**Fixes**:
1. Correlation IDs for request tracing
2. Circuit breakers to prevent cascade failures
3. Proper timeout handling at each layer
4. Distributed tracing for visualization
5. Connection pool tuning and monitoring

### Key Takeaways
- Distributed systems require correlation
- Circuit breakers prevent cascade failures
- Timeouts should be set at each layer
- Logging must be consistent across services
- Tracing tools visualize request paths

## Common Issues and Troubleshooting

### Issue 1: Can't Reproduce Bug Locally

**Solution**:
- Capture production traffic for replay
- Use production-like data volumes
- Match production configuration
- Test under similar load conditions

### Issue 2: Intermittent Bugs

**Solution**:
- Add detailed logging
- Use distributed tracing
- Load test to increase occurrence rate
- Capture state when bug occurs

### Issue 3: Performance Degradation Over Time

**Solution**:
- Profile memory usage over time
- Monitor connection pools
- Check for resource leaks
- Review cache effectiveness

## Extensions for Advanced Learners

### Extension 1: Build a Debugging Toolkit

Create scripts for:
- Taking heap snapshots
- Analyzing CPU profiles
- Capturing network traces
- Replaying production traffic

### Extension 2: Implement Observability

Add comprehensive observability:
- Structured logging
- Metrics (Prometheus)
- Distributed tracing (Jaeger)
- Alerting (based on SLOs)

### Extension 3: Chaos Engineering

Introduce controlled failures:
- Random service delays
- Network partitions
- Resource exhaustion
- Dependency failures

Verify system resilience.

## Summary

You've learned to:
- Analyze complex stack traces systematically
- Debug race conditions and async issues
- Identify and fix memory leaks
- Debug multi-service distributed systems
- Implement proper error handling and recovery
- Use profiling and tracing tools effectively

## Next Steps

1. Apply debugging techniques to real production issues
2. Build observability into all services
3. Create debugging runbooks for common issues
4. Proceed to Lab 004: Repository Analysis

---

**Lab Completion**: You've completed Lab 003. You should now be equipped to debug complex, real-world issues systematically using Claude as a debugging partner.
