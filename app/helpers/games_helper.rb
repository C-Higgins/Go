module GamesHelper


	# @return [board]
	def getNewBoard board, move
		board[move['index']] = move['color']
		dead                 = findDeadStones board, move['index']
		newBoard = clearStones board, dead
		return newBoard
	end

	# @return array of dead indices
	# board: an array of colors
	# moveIndex: integer index of newest move
	def findDeadStones(board, moveIndex)
		dead         = []
		b            = Array.new(board)
		b[moveIndex] = opposite_of b[moveIndex]
		dead         += startRecursion b, moveIndex
		dead.delete(moveIndex)

		return dead
	end

	def clearStones board, deaths
		return board if deaths.empty?
		newBoard = Array.new(board)
		deaths.each do |i|
			newBoard[i] = ''
		end
		return newBoard
	end

	private
	def startRecursion b, moveIndex
		dead      = []
		localdead = []
		stop      = false

		def recurse stone, target, replacement, b, localdead, stop
			return if stone.nil?
			return if target == replacement
			return if b[stone] != target
			return if stop
			if b[stone] == ''
				stop      = true
				localdead = nil
				return
			end

			b[stone] = replacement
			localdead << stone
			recurse dir(stone, 'l', b), target, replacement, b, localdead, stop
			recurse dir(stone, 'r', b), target, replacement, b, localdead, stop
			recurse dir(stone, 'u', b), target, replacement, b, localdead, stop
			recurse dir(stone, 'd', b), target, replacement, b, localdead, stop

			stop = false
			return localdead
		end

		return recurse moveIndex, b[moveIndex], 'R', b, localdead, stop
	end


	def dir index, direction, b
		dimensions = Math.sqrt(b.size) #19

		case direction
			when 'l'
				return index-1 if index % dimensions != 0
			when 'r'
				return index+1 if index+1 % dimensions != 0
			when 'u'
				return index - dimensions if index >= dimensions
			when 'd'
				return index + dimensions if index < dimensions * (dimensions - 1)
			else
				return nil
		end
	end

	def opposite_of color
		return 'WHITE' if color == 'BLACK'
		return 'BLACK' if color == 'WHITE'
		return '-'
	end
end


#  O O X -
#  O x O X
#  X X X -
#  - - - -

