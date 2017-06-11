# Dennis
Prototype for Github events data exposure via API

## Installation

Make sure you have **Node.js** and **npm** installed on your machine.

Clone the repo and run the following:

```
$ npm install
```
Make sure you have MongoDB installed, you can follow this [link](https://www.howtoforge.com/tutorial/install-mongodb-on-ubuntu-16.04/) for installation on Debian machines.

## Usage

To seed the DB with the data dump and then start the sever run the following:

```
$ npm run seed

$ npm start
```
The server will be listening on **http://localhost:3000/**

The API is divided into entities as described by the models. *Events*, *Actors* and *Repos*

The server exposes the API as follows :

`GET /events?type=[x]&repo=[x]` : returns all events filtered by optional params *type=* and *repo=* for event type and repo id . The returned data is limited for 100 docs at a time due to the size of these documents. *self* and *next* links are provided for pagination.

`GET /actors/` : returns all actors, also paginated with reference links.

`GET /actors/:login/repos` : returns actor with list of repos he has contributed to.

`GET /actors/:login/topRepo` : returns actor with top repo that he has contributed to, along with his contribution count to said repo.

`DELETE /actors/:login/events` : deletes all events related to said actor.

`GET /repos/` : returns all repos with top contributer (actor) for each. Also paginated with reference links.


