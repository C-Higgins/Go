module CableHelper
	include GamesHelper
	include PlayersHelper

	def refresh_games_list!
		g = all_pending_games.select(:id, :webid, :timer, :inc).to_json(
			include: {
				involvements: {
					include: {
						player: {
							only: [:display_name, :id]
						}
					}
				},

			}
		)
		ActionCable.server.broadcast 'lobby', g
		g
	end

	def update_waiters! game
		ActionCable.server.broadcast 'waiting', {p1: game.players.first.id, p2: game.players.second.id, id: game.webid}
	end

	def join(game, user)
		GameroomChannel.broadcast_to(game, {friend_joined: user.involvements.last.as_json(include: :player)})
	end
end