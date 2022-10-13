About: this project mocks a wallet app that allows users to sign up, login, see other users if authenticated, fund their wallet, withdraw, transfer to other users.

written in typescript and using knex as a query builder.

knex is not a full fledged orm and has limitations that makes it a tad bit difficult to be used as a full orm especially as we are using OOP, so i paired it with Objections, an orm built on knex

this is the database design schema

database Structure:
![My Image](./images/dbschema.png)

to run, run npm install, 
install knex globally using npm install knex -g (this is recommended for easily running migrations)

add your mysql connection credentials to .env

run "npm run migration:run" to run migrations and create neccesary tables

run "npm run dev" to start the app

test the apis using this postman collection as guide:
https://documenter.getpostman.com/view/12165874/2s83zpK1Sm

to deploy to live server:

the app is deployed to heroku, using a deployment pipeline, so you would need to add your credentials to git and heroku.

the following steps are neccessary:


*create a new heroku app

*put the heroku app name on the heroku_app_name field of pipeline.yml 

*add .env credentials to the config vars section

*on github goto setting -> secrets -> actions and add the following

key: "DEPLOY_EMAIL" value: 'your heroku_email'
key: "HEROKU_API_KEY" value: 'your heroku_api_key'
key: "ENV": value:  WTKEY=
                    PORT=
                    DB_HOST=
                    DB_PORT=
                    DBUSER=
                    PASSWORD=
                    DATABASE=

*Note: value for ENV key is your .env configs





