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
		board = getNewBoard(@game, move)
		unless board.nil?
			@game.update_attributes(history: @game.history.concat(['squares' => board]), move: @game.move+1)
			GameroomChannel.broadcast_to(@game, @game.history.last) if @game.save
		end
	end
end
