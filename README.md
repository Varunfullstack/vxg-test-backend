Steps to run this project:

1. Run `npm i` command
2. Create .env file and copy parameters from .dev.env file
3. Replace env variable values as per your configuration
4. Replace variable from firebase.json with your project configurations or download service file from firebase console.

- # Download service file:
  - Go to firebase console
  - Select your project
  - Click on settings
  - Click on service accounts
  - Click on generate new private key
  - Download the file and replace it with firebase.json

7. Run `npm start` command

# Folder Structure

- backend/
  - src/
    - controller/
    - entity/
    - middlewares/
    - migrations/
    - repository/
    - routes/
    - service/
    - utils/
    - data-source.ts
    - firebase.ts
    - index.ts
  - .env
  - .gitignore
  - package-lock.json
  - package.json
  - README.md
  - tsconfig.json
  - firebase.json

# Libraries used:

- express (typescript)
- typeorm (ORM for mysql)
- dotenv (for environment variables)
- cors (for cross-origin requests)
- jsonwebtokens (for authentication)
- firebase-admin (for firebase authentication)
- mysql2 (mysql driver)
- concurrently (for running multiple scripts)
- nodemon (for auto-restart server)
