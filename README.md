## CDMA simulation and workaround for student of Kiev National University

# Build process

1. update your `db-config.json` file to contain correct credentials for mongo database
2. install `nodejs` and then install all deps through `npm install` in directory.
3. to run application locally you should install `gulp` globally `npm install gulp-cli -g`
4. `gulp serve` will start your server locally and you should be able to see it on `localhost:3000`
5. `gulp prod` will create build package for the heroku
6. commit all your changes and run `git push heroku master` then your can run `heroku open` and it will redirect you to the deployed page
7. `heroku config:push` will set all the environmental variables from `.env` file to the server (for that comman you should have additional plugin, google `heroku config plugin`)

Working example can be found [here](https://correlation-modeling.herokuapp.com/)