Steps to clone the project

git clone <link>
npm install react-bootstrap bootstrap 

//frontend

//installing dependencies
cd client
npm install web-vitals
npm install react-router-dom
npm install react-chartjs-2@^4.0.0 chart.js@^3.0.0
npm list react-chartjs-2 chart.js
npm install file-saver xlsx
npm install lucide-react jspdf html2canvas
yarn add lucide-react jspdf html2canvas
npm install react-icons




//run
npm start


//backend

//installing dependencies
cd server
npm i mysql express cors nodemon
npm install bcrypt
npm install jsonwebtoken


//run
npm start




// to kill the port that is already running
//manually
netstat -ano | findstr :8800
taskkill /PID 12345 /F
Forcefully
npx kill-port 8800


