# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameroomChannel < ApplicationCable::Channel
	include GamesHelper
	include TimeHelper

	def subscribed
		game = Game.find_by(webid: params[:room])
		stream_for game
		@locked = false
	end

	def unsubscribed # Sender is in self.connection.user
		# Any cleanup needed when channel is unsubscribed
		#start user left game timer
	end

	def receive data # the sender is in self.connection.user
		# Send:
		#  game_over: {
		#  message: string
		#  score {
		#  white: int
		#  black: int
		# }
		# }
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

		sent_at        = Time.now
		@game          = Game.find_by(webid: params[:room])
		sender         = self.connection.user
		senderInv      = sender.involvements.where(game_id: @game.id).first
		last_move_time = @game.last_move

		if data['chat']
			if self.connection.user.anonymous
				author = "<#{senderInv.color ? 'Black' : 'White'}>"
			else
				author = sender.display_name
			end
			res = {
				message: data['chat'],
				author:  author
			}
			broadcast_chat(res)
		end
		return if @game.completed || data.nil?

		if data['move'] #New move or pass
			return if @game.history.length % 2 == senderInv.color #not your turn
			return if @locked #Complete the move before accepting new moves
			@locked = true
			if data['move']['pass']
				sysmsg = {
					message: "#{sender.display_name} has passed.",
					author:  nil,
					system:  true,
				}
				broadcast_chat(sysmsg)
			end
			data['move']['color'] = senderInv.color
			new                   = getNewBoard(@game, data['move'])
			new_time              = get_new_time(last_move_time, sent_at, senderInv.timer, @game.inc)
			if new[:end_of_game]
				result = end_game(@game, data)
				GameroomChannel.broadcast_to(@game, game_over: result)
				broadcast_chat({message: result[:message], system: true})
			elsif !new[:board].nil?
				@game.update_attributes(
					history:   @game.history.push(new[:board]),
					move:      @game.move+1,
					ko:        new[:ko],
					last_move: Time.now,
				) &&
					GameroomChannel.broadcast_to(@game, {
						move:    [@game.history.last],
						newTime: new_time
					})
				senderInv.update_attributes(timer: new_time)
				@locked = false
			end

		elsif data['draw_request']


		elsif data['takeback_request']

		elsif (data.keys & ['resign', 'draw', 'abort']).any?
			result        = end_game(@game, data, sender)
			result[:time] = get_new_time(last_move_time, sent_at, senderInv.timer, 0)
			broadcast_chat({message: result[:message], system: true})
			GameroomChannel.broadcast_to(@game, game_over: result)
			senderInv.update_attributes(timer: result[:time])
		elsif (data['time_up'])
			loser = Involvement.find(data['time_up'])
			return if sender.id != loser.player_id
			new_time = get_new_time(last_move_time, sent_at, loser.timer, 0)
			if new_time <= 0
				result = end_game(@game, data, loser)
				GameroomChannel.broadcast_to(@game, game_over: result)
				broadcast_chat({message: result[:message], system: true})
				loser.update_attributes(timer: 0)
			end
			@locked = false
		end
	end

	def broadcast_chat msg
		@game.update_attributes(messages: @game.messages.push(msg))
		return GameroomChannel.broadcast_to(@game, chat: msg)
	end
end
