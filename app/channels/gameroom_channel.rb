# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameroomChannel < ApplicationCable::Channel
	def subscribed
		stream_from "#{params['room']}"
	end

	def unsubscribed
		# Any cleanup needed when channel is unsubscribed
	end

	def receive data
		@game = Game.find_by(webid: data["webid"])
		history = data["data"]
		# validate history
		@game.update_attributes(history: history)
		if @game.save
			ActionCable.server.broadcast("#{params['room']}", history)
			puts ''
		end
	end
end
