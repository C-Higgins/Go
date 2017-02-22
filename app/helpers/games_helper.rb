module GamesHelper

	def all_pending_games
		Game.where(in_progress: false, completed: false)
	end

	# @return board array if move validates, else return nil
	def getNewBoard game, move
		board  = Array.new(game.history.last)
		square = move['index']

		# Can't move where something already is
		return nil if board[square] != ''

		# make the move...
		board[square] = move['color']

		# Can't place a stone that causes itself to be captured unless it captures first
		# First check if you just captured anything - if so you're fine
		# Otherwise check if you are now captured
		captured      = getCapturedStones(board, square)

		return clearStones(board, captured) if captured.any?
		return board if getDeadGroup(Array.new(board), square, board[square]).empty?
		return nil
	end

	private

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
			right: index + 1 % dimensions != 0 ? index + 1 : index,
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

