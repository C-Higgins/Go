# README

This is a simple website to play the game of go.

# Ruby version
Currently runs in Ruby 2.2.3 on Rails 5.0.0.1

# Implementation

Site is comprised of games, players, and their involvements with each other.

Websockets are implemented with ActionCable and handle the communications during the games and within the lobby. Websocket connections are routed through a Redis server.

The game itself and all interactive elements are rendered with React using the react-rails gem.

# Structure
## /app
JS and CSS files, including the clientside websocket code and react components, are served from app/assets. 

Channels contains the server side websocket code.

Controllers handle all logic involving a URL change or a CRUD action. Also contains code for handling sessions.

Helpers contain the implementations of controller logic in the form of helper methods.

Jobs / Mailers currently unused.

Models deals with the game and player models and their validations and interactions.

Views stores the HTML and erb files to be rendered.

## /config
Configurations for the database, websockets, routes, and related server information.

## /db
The schema(s) and migrations

## /public
Any images or favicons or other files

## /test 
All tests and their helper methods




