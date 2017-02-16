module GamesHelper


	# @return [board]
	def getNewBoard game, move
		board                = Array.new(game.history.last['squares'])
		board[move['index']] = move['color']
		dead                 = findDeadStones board, move['index']
		newBoard             = clearStones board, dead
		return newBoard
	end

	# @return array of dead indices
	# board: an array of color strings
	# square: index of newest move
	def findDeadStones(board, square)
		dead        = []
		targetColor = opposite_of(board[square])
		getDirections(board, square).each_value { |d| dead.concat deadGroup(board, d, targetColor) }
		return dead
	end


	# @param board, the board
	# @param square, index of square in group being checked
	# @param target, color being checked
	# @return array of dead indices or []
	def deadGroup board, square, target
		board = Array.new(board)
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


	private

	def clearStones board, deaths
		return board if deaths.empty?
		newBoard = Array.new(board)
		deaths.each do |i|
			newBoard[i] = ''
		end
		return newBoard
	end


	# @return hash of form {direction: index}
	# if OOB return same index
	def getDirections board, index
		dimensions = Math.sqrt(board.size) #19
		return {
			left:  index % dimensions != 0 ? index-1 : index,
			right: index+1 % dimensions != 0 ? index+1 : index,
			up:    index>=dimensions ? index-dimensions : index,
			down:  index < dimensions * (dimensions - 1) ? index+dimensions : index
		}
	end

	def opposite_of color
		return 'WHITE' if color == 'BLACK'
		return 'BLACK' if color == 'WHITE'
		return ''
	end


end

#  O O X -
#  O x O X
#  X X X -
#  - - - -

