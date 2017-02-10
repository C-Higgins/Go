module GamesHelper


	# @return [board]
	def getNewBoard board, moveIndex
		dead     = findDeadStones board, moveIndex
		newBoard = clearStones board, dead
		return newBoard
	end

	# @return array of dead indices
	# board: an array of colors
	# move: index of newest move
	def findDeadStones(board, moveIndex)
		b         = Array.new(board)
		dead      = []
		localdead = []
		stop      = false

		b[moveIndex] = opposite_of b[moveIndex]
		dead         += recurse moveIndex, b[moveIndex], 'R'
		dead.delete(moveIndex)

		return dead

		def recurse stone, target, replacement
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
			recurse dir(stone, 'l'), target, replacement
			recurse dir(stone, 'r'), target, replacement
			recurse dir(stone, 'u'), target, replacement
			recurse dir(stone, 'd'), target, replacement

			stop = false
			return localdead
		end

		def dir index, direction
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
			return 'W' if color == 'B'
			return 'B' if color == 'W'
			return '-'
		end
	end

	def clearStones board, deaths
		newBoard = Array.new(board)
		deaths.each do |i|
			newBoard[i] = ''
		end
		return newBoard
	end
end


#  O O X -
#  O x O X
#  X X X -
#  - - - -

