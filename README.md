# Todo-list-Socket.io

## Requirements

-  Docker =>19.03
-  Yarn =>1.19
-  MongoDb => 4.2
-  Node.js => 12.3

## How to start:
 
### 1.Configure the .env:
    
    Copy the `.env.example` from `api` to `.env.production`
    
    Copy the `.env.example` from `client` to `.env.production` & `.env.development`
    
    
 ### 2. Install dependence
   
   Type `cd ./api && yarn && cd ../client && yarn && cd ..` to install its dependencies.


   
## Using Docker

Docker has all the necessary settings

Just type `docker-compose up --build`

Access `http://localhost:5000` on the browser.



# Start for development:

   -  Type `cd ./api && yarn start` to start the web and server.
   -   Change proxy in `./client/package.json` to you network for example `http://localhost:8080`
   -   In new terminal Type `cd ./client && yarn` to start the web.
   -  Access `http://localhost:3000` on the browser.
