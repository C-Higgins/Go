# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameroomChannel < ApplicationCable::Channel
	include GamesHelper

	def subscribed
		game = Game.find_by(webid: params[:room])
		stream_for game
	end

	def unsubscribed
		# Any cleanup needed when channel is unsubscribed
	end

	def receive data
		@game = Game.find_by(webid: params[:room])
		move  = data['newMove'] #{index: 122, color: 'WHITE'}
		board = getNewBoard(@game.history.last['squares'], move)
		# @game.update_attributes(board: board, move: @game.move++)
		@game.update_attributes(history: @game.history.concat(['squares' => board]))
		if @game.save
			GameroomChannel.broadcast_to(@game, @game.history.last)
		end
	end
end
