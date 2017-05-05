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

	def receive data # the sender is in self.connection.user
		# Send:
		#  game_over: string
		#  chat: {
		#  message: string
		#  author: string
		#  }
		#  friend_joined: <Player>
		#  move: string[]
		#  drawr:
		#  taker:
		#
		# Receive:
		#  move: {
		#  pass: bool
		#  index: int
		#  }
		#  chat: string
		#  resign: bool
		#  offerd: bool
		#  offert: bool

		@game = Game.find_by(webid: params[:room])

		if data['chat']
			res = {
				message: data['chat'],
				author:  self.connection.user.display_name
			}
			@game.update_attributes(messages: @game.messages.push(res))
			return GameroomChannel.broadcast_to(@game, chat: res)
		end
		return if @game.completed || data.nil?

		if data['move'] #New move or pass
			data['move']['color'] = self.connection.user.involvements.where(game_id: @game.id).first.color ? 'B' : 'W'
			new                   = getNewBoard(@game, data['move'])
			score                 = territory(@game.history.last)

			if new[:end_of_game]
				result = end_game(@game, data)
				GameroomChannel.broadcast_to(game, game_over: result[:message], score: score)
			elsif !new[:board].nil?
				@game.update_attributes(
					history: @game.history.push(new[:board]),
					move:    @game.move+1,
					ko:      new[:ko]
				) &&
					GameroomChannel.broadcast_to(@game, move: [@game.history.last], score: score)
			end

		elsif data['draw_request']


		elsif data['takeback_request']

		elsif data.keys.any? {|key| ['resign', 'draw', 'abort'].include? key}
			result = end_game(@game, data, self.connection.user)
			GameroomChannel.broadcast_to(@game, game_over: result[:message])
		end
	end
end
