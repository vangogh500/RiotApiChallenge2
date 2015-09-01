# Riot API Challenge 2.0

## Overview
Black Market Statistics is a web app, which collects statistics on Black Market Brawler matches from the Riot API.
The app utilizes a node.js server using the express.js environment and is hosted via OpenShift.

The app (still in development) is available at [here](http://blackmarketstats-vangogh500.rhcloud.com/). Please note that processing can be slow due to a low college budget and its dual role in fetching and parsing data.


**Note:**
Unfortunately due to how OpenShift works, I have to commit and push to make alterations to the app. It would probably be unwisely to have two seperate git repositories for the same project, thus the commits on this repo are ubundant with tests and bug fixes that had to be dealt with in real time.

## The Server
The server is run using Node.js and Express.js on a free OpenShift server.

### Dependencies
- Express-handlebars v2.0.1
- Mongoose v4.1.3
- Async v1.4.2
- Bower v1.5.2
- Node v0.6.0
- Express v3.4.8

### Important Files
- [server.js](https://github.com/vangogh500/RiotApiChallenge2/blob/master/server.js) - the main server script
- [routes.js](https://github.com/vangogh500/RiotApiChallenge2/blob/master/server.js) - the route handlers for the server

The OpenShift `nodejs` cartridge documentation can be found at:
http://openshift.github.io/documentation/oo_cartridge_guide.html#nodejs

## The Database
The app utilizes a NoSQL database (MongoDB) and utilizes it through the use of mongoose.

### Important Files
- [models](https://github.com/vangogh500/RiotApiChallenge2/tree/master/models) - directory contains all models for formatting our data
- [lib/riot](https://github.com/vangogh500/RiotApiChallenge2/tree/master/lib/riot) - directory contains all javascripts pertaining to the collection of data from the Riot Api

### Logic
All match information that is collected from the Riot API is stored in 5 objects. The goal being to make backtracking as easy as possible while allowing for quick computations.

- `Participants` - contains all in-game data pertaining to a specific player
  - kills, assists, gold, item build, etc
- `Teams` - contains all in-game information pertaining to a specific team
  - team objects such as barons, dragons, etc
  - references to the `Participant` objects belonging to the team
- `Match` - contains information on the particular match
  - date, time, region
  - references to the `Team` objects that belong to the match
- `Champion` - contains statistics gathered on a specific champion
  - static data including name, image url, etc
  - averages such as kills, assists, gold, picks, wins
  - item builds and the `Match`s associated with them
  - references to the `Match` objects that the champions were played in  
- `Item` - contains statistics gathered on a specific item
  - static data including name, image url, etc
  - averages such as picks and wins
  - champions and the `Match`s associated with them
  - references to the `Match` objects that the items were bought in
 
## API
To make data visible to the client a basic api is set up to serve information from the MongoDB database to the client.

- `/api/champions` - returns a json object containing all `Champion` objects in the database
- `/api/matches` - returns a json object containing all `Match` objects


## Client
 Computations for customized statistics and rendering logic is done on the client side via AngularJs.
 
 ### Dependencies
 
 - AngularJs v1.4.5
 - Google Visualization Library

### Changelog

 - v0.0.1 Collected match datas from NA, implemented a basic display of win rates vs. pick rates

## Goals
The goal of this app is to serve statistics on Black Market Brawler matches in a flexible/interactive way.

- Add match selector: Users will be able to select matches they want tOro be included in their statistics via interface. Filters such as regions/items/etc should be available.
- Axis customization: Allow users to choose what is being graphed against what. Item pick rate vs. win rate filtered for a given champ (using the match selector). Team barons vs. win rate filtered for a given item. Etc.

## Acknowledgements
Thanks to the following sources for guiding me along with my first attempt at backend development and with AngularJS.

- OReily's AngularJS Up and Running
- OReily's Web Development with Node and Express

And as usual the StackOverFlow community.

## Suggestions/Contact
If you'd like to make a suggestion or would like to join the project, you can email me at matsudaskai@gmail.com. Just make sure to make the subject line start with: "Black Market Brawlers Stats".



 