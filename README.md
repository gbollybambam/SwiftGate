# SwiftGate

**SwiftGate: Blacksmith Experience Challenge Submission**

SwiftGate is an API-first, event-driven payment gateway built with Node.js and Express. Designed to handle the strict concurrency requirements of financial technology, SwiftGate eliminates the classic "webhook race condition" using pessimistic database locking. It provides merchants with developer-friendly APIs for backend integration, robust asynchronous webhook delivery via Redis/BullMQ, and hosted, no-code Payment Links for non-technical sellers.

## Key Technical Features

* **Idempotency & Race Condition Prevention:** Utilizes database-level pessimistic locking (`SELECT ... FOR UPDATE`) to ensure concurrent webhooks and browser callbacks never result in double-crediting.
* **Event-Driven Webhook Dispatch:** Implements a decoupled, retry-capable background queue to securely deliver asynchronous payment notifications to merchant servers.
* **Hosted Payment Links:** Secure checkout tokens allow non-technical merchants to generate public payment interfaces directly from the API.

---
*Built by Gbolahan for the Blacksmith Experience.*
