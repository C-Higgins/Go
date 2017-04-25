# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameroomChannel < ApplicationCable::Channel
	include GamesHelper

	def subscribed
		game = Game.find_by(webid: params[:room])
		stream_for game
	end

	def unsubscribed # Sender is in self.connection.user
		# Any cleanup needed when channel is unsubscribed
		#start user left game timer
	end

	def receive data # Sender is in self.connection.user
		@game = Game.find_by(webid: params[:room])
		return if @game.completed || data.nil?
		return GameroomChannel.broadcast_to(@game, data) if data['draw_request']
		return end_game @game, data, self.connection.user if data.keys.any? { |key| ['resign', 'draw', 'abort'].include? key }

		new = getNewBoard(@game, data['newMove'])
		return end_game @game, data if new[:end_of_game]
		unless new[:board].nil?
			@game.update_attributes(history: @game.history.push(new[:board]), move: @game.move+1, ko: new[:ko])
			GameroomChannel.broadcast_to(@game, move: [@game.history.last]) if @game.save
		end
	end
end
