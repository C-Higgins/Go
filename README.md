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
### /app/assets
JS and CSS files, including the clientside websocket code and react components

### /app/channels
The server side websocket code.

### /app/controllers
All logic involving a URL change or a CRUD action. Also contains code for handling sessions.

### /app/helpers
The implementations of controller logic in the form of helper methods.

### /app/models
Deals with the game and player models and their validations and interactions.

### /app/views
The HTML and erb files to be rendered.

## /config
Configurations for the database, websockets, routes, and related server information.

## /db
The schema(s) and migrations

## /public
Any images or favicons or other files

## /test 
All tests and their helper methods




