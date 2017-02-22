# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class WaitingChannel < ApplicationCable::Channel
	def subscribed
		stream_from "waiting"
	end
	#
	def unsubscribed
		leaver = Player.find_by(id: params[:user])
		leaver.games.where(in_progress: false).destroy_all
		ActionCable.server.broadcast 'lobby', Game.joins(:players).group('id').having('count(players.id)<2').to_json(include: :players)
		# Any cleanup needed when channel is unsubscribed
	end
	#
	# def receive data
	# 	@game = Game.find_by(webid: data["webid"])
	# 	history = data["data"]
	# 	# validate history
	# 	@game.update_attributes(history: history)
	# 	if @game.save
	# 		GameroomChannel.broadcast_to(@game, history)
	# 	end
	# end
end