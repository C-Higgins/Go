# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameroomChannel < ApplicationCable::Channel
	def subscribed
		game = Game.find_by(webid: params[:room])
		stream_for game
	end

	def unsubscribed
		# Any cleanup needed when channel is unsubscribed
	end

	def receive data
		@game = Game.find_by(webid: params[:room])
		move  = data['newMove']
		# validate history
		@game.update_attributes(history: @game.history.concat([move]))
		if @game.save
			GameroomChannel.broadcast_to(@game, move)
		end
	end
end
