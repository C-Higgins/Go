module GamesHelper

	def all_pending_games
		Game.where(in_progress: false, completed: false, private: false)
	end

	# @return board array if move validates, else return nil
	# @return new ko position
	# move should contain {index, color} or {pass}
	def getNewBoard game, move
		if (move['pass'])
			return {board: nil, ko: nil, end_of_game: true} if game.history.last == game.history[-2] # last move was also a pass
			return {board: game.history.last, ko: nil} # normal pass
		end

		board  = Array.new(game.history.last)
		square = move['index']
		ko     = game.ko

		# Can't move where something already is
		return nil if board[square] != ''

		# make the move...
		board[square] = move['color']

		# Can't place a stone that causes itself to be captured unless it captures first
		# Can't place a stone in a ko position that only captures one stone
		# One may not capture just one stone, if that stone was played on the previous move, and that move also captured just one stone.
		# First check if you just captured anything
		captured      = getCapturedStones(board, square)
		if captured.any?
			if captured.size == 1 # Captured only one stone, so check/set ko
				if captured[0] == ko # illegal move, trying to capture the ko stone
					return nil
				else # this move is new ko
					ko = square
				end
			else # captured more than one, so reset ko
				ko = nil
			end

			return {board: clearStones(board, captured), ko: ko}
		end


		# Didn't cap anything, ensure no suicide
		return {board: board, ko: nil} if getDeadGroup(Array.new(board), square, board[square]).empty?

		# suicide, illegal move
		return {board: nil, ko: nil}
	end

	def end_game game, data, sender=nil
		type = data.keys.last
		case type
			when 'newMove' #Game ended naturally
				result = calc_winner @game
			when 'resign'
				loser_color = sender.involvements.find_by(game_id: game.id).color
				result      = {
					message: result_message('resign', !loser_color, loser_color),
					loser:   sender,
					winner:  game.players.where.not(id: sender.id).first
				}
			when 'draw'
				result = {
					message: result_message('draw'),
					draw:    true
				}
			else
				return
		end

		game.update_attributes(in_progress: false, completed: true, result: result[:message])
		if result[:draw]
			game.white_player.involvements.find_by(game_id: game.id).update_attributes(draw: true, winner: false)
			game.black_player.involvements.find_by(game_id: game.id).update_attributes(draw: true, winner: false)
		else
			result[:winner].involvements.find_by(game_id: game.id).update_attributes(winner: true)
			result[:loser].involvements.find_by(game_id: game.id).update_attributes(winner: false)
		end
		GameroomChannel.broadcast_to(game, result)
	end


	private

	def calc_winner game
		board  = Array.new(game.history.last)
		#filled = fill_territory board       implement this
		filled = board

		case filled.count('W') <=> filled.count('B')
			when 1
				{
					message: result_message('score', 'White', 'Black'),
					winner:  game.white_player,
					loser:   game.black_player
				}
			when 0
				{
					message: result_message('draw'),
					draw: true,
					winner:  nil,
					loser:   nil
				}
			when -1
				{
					message: result_message('score', 'Black', 'White'),
					winner:  game.black_player,
					loser:   game.white_player
				}
		end
	end

	def bool_to_string bool
		bool ? 'Black' : 'White'
	end

	def result_message type, winner=nil, loser=nil
		winner = bool_to_string winner unless winner.is_a? String
		loser  = bool_to_string loser unless loser.is_a? String
		case type
			when 'score'
				"#{winner} is victorious."
			when 'resign'
				"#{loser} resigned. #{winner} is victorious."
			when 'time'
				"#{loser}'s time expired. #{winner} is victorious."
			when 'draw'
				'Draw.'
			when 'agree'
				"#{loser} agreed to draw."
			when 'leave'
				"#{loser} left the game. #{winner} is victorious."
			when 'abort'
				'Game aborted.'
			else
				'Unknown result.'
		end
	end

	# @return array of dead indices
	# board: an array of color strings
	# square: index of newest move
	def getCapturedStones(board, square)
		captured    = []
		targetColor = opposite_of(board[square])
		deathBoard  = Array.new(board)
		getDirections(board, square).each_value { |d| captured.concat getDeadGroup(deathBoard, d, targetColor) }
		return captured
	end


	# @param board, the board
	# @param square, index of square in group being checked
	# @param target, color being checked
	# @return array of dead indices or []
	# Note this modifies board
	def getDeadGroup board, square, target
		return [] if board[square] != target
		board = Array.new(board)
		queue = [square]
		dead  = []
		until queue.empty? do
			n = queue.shift
			dead.push n
			board[n] = 'R'
			dirs     = getDirections(board, n)
			# If there is an empty square adjacent, group is not dead
			return [] if board.values_at(*dirs.values).include? ''
			dirs.each_value { |dir| queue.push(dir) if board[dir]==target }
		end
		return dead
	end

	def clearStones board, deaths
		return board if deaths.empty?
		newBoard = Array.new(board)
		deaths.each { |i| newBoard[i] = '' }
		return newBoard
	end


	# @return hash of form {direction: index}
	# if OOB return same index
	def getDirections board, index
		dimensions = Math.sqrt(board.size) #19
		return {
			left:  index % dimensions != 0 ? index - 1 : index,
			right: (index + 1) % dimensions != 0 ? index + 1 : index,
			up:    index >= dimensions ? index-dimensions : index,
			down:  index < dimensions * (dimensions - 1) ? index + dimensions : index
		}
	end

	def opposite_of color
		return 'W' if color == 'B'
		return 'B' if color == 'W'
		return ''
	end


end

#  O O X -
#  O x O X
#  X X X -
#  - - - -

