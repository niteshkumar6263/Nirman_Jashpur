# Nirman Jashpur Backend

This is the backend for the Nirman Jashpur project, built with Node.js and Express.

## Setup Instructions

1. **Clone the repository**
   ```powershell
   git clone <your-repo-url>
   cd Nirman_Jashpur/Nirman_Jashpur_Backend
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Environment variables**
   - Copy `.env.example` to `.env` and fill in the required values.
   ```powershell
   copy .env.example .env
   ```

4. **Run the development server**
   ```powershell
   npx nodemon index.js
   ```
   - Replace `index.js` with your main server file if different.

## Main Packages Used
- express
- dotenv
- cors
- morgan
- nodemon (dev)

## Additional Notes
- Make sure Node.js and npm are installed on your system.
- For production, use `node index.js` instead of nodemon.

---
Feel free to update this README with more details as your project grows.
