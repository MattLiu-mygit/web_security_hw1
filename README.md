# Getting Started

## Setup

1. Install node here: https://nodejs.org/en/download/
2. After installing node, install all dependency packages. This can be done by running "npm i" in the root directory of the project.
3. To start the server app, you may need to install venv, python-dotenv, and flask. This can be done in the following sequence:
   1. python3 -m venv venv
   2. venv\Scripts\activate
   3. pip install flask python-dotenv
   4. I followed this tutorial to make the server work. If there is any issues encountered along the way, this link may provide answers for why the server won't start up: https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project
4. Run "npm run start-server-windows" on windows or "start-server-mac" for mac. The windows command should work. The mac command may not work, as I don't have a mac OS handy so it has not been tested. Again, refer to the link above for any issues. I'm sorry, as I'm not proficient in writing python backends. This is my first time! X_X
5. To start the client app, run "npm start" which will start a localhost that runs the client app on port 3000 by default.

## Game instructions

1. Start by opening up two client apps.
2. Start the server app.
3. Once game concludes, reload each client app first and then restart the server app. Unfortunately, disconnect using socketio has not been figured out.
   Note: DO NOT refresh or close client apps. This will mess with server states, as there is no proper handling of disconnect events. If any client apps get refreshed or closed, please follow steps 1-3 again.
