# SwiftGate API

## Local Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   `npm install`
3. **Configure the environment:**
   Copy `.env.example` to `.env` and provide your local PostgreSQL connection string.
   `cp .env.example .env`
4. **Ensure PostgreSQL is running locally.** The service will automatically create the database and apply the schema upon startup.
5. **Start the service:**
   `node src/index.js`
   
*Note: The database schema will automatically build upon service startup.*

## Health Check
To verify the service is running and connected to the database, ping the health endpoint:
`GET /health`