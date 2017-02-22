module PlayersHelper
	def pending_games user
		user.games.where(in_progress: false, completed: false)
	end

	def ongoing_games user
		user.games.where(in_progress: true)
	end
end
