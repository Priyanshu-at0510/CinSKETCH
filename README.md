# CineDraw

CineDraw is an interactive, real-time multiplayer game where players guess movies based on drawings. It combines the fun of Pictionary with cinematic knowledge, creating an engaging experience for film enthusiasts and casual players alike.

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components

- **Backend:**
  - Node.js
  - Express.js
  - PostgreSQL
  - Prisma ORM

- **Real-time Communication:**
  - WebSocket (Socket.io)

- **Authentication:**
  - JWT (JSON Web Tokens)

## Features

- User authentication (signup, signin, signout)
- Create and join game rooms
- Real-time drawing and guessing
- Chat functionality during gameplay
- Scoring system
- Movie database with different difficulty levels
- Responsive design for desktop and mobile

## Database Schema

Our PostgreSQL database, managed through Prisma, includes the following main models:

- User
- GameRoom
- Player
- Guess
- Movie
- GameMovie
- GameSession

(For detailed schema, please refer to the `schema.prisma` file in the project)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Adityaat2810/CineSketch
    cd cinedraw
    ```

2. Install dependencies:
    ```sh
    cd client
    npm install
    cd ../server
    npm install
    ```

3. Set up your environment variables in a `.env` file:
    ```env
    DATABASE_URL="add your relational db url here"
    JWT_SECRET="your-secret-key"
    ```

4. Run database migrations:
    ```sh
    npx prisma migrate dev --name <migration_name>
    ```

### Running the Application

1. Start the backend server:
    ```sh
    cd server
    npm start
    ```

2. Start the frontend development server:
    ```sh
    cd client
    npm start
    ```
