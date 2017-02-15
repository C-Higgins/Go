module GamesHelper


	# @return [board]
	def getNewBoard game, move
		$board                = Array.new(game.history.last['squares'])
		$board[move['index']] = move['color']
		dead                  = findDeadStones move['index']
		newBoard              = clearStones dead
		return newBoard
	end

	# @return array of dead indices
	# board: an array of colors
	# moveIndex: integer index of newest move
	def findDeadStones(moveIndex)
		$newBoard = Array.new($board)
		$stop     = false
		dead         = []
		dead.concat recurse(dir(moveIndex, 'l'), opposite_of($newBoard[moveIndex]), dead)
		dead.concat recurse(dir(moveIndex, 'r'), opposite_of($newBoard[moveIndex]), dead)
		dead.concat recurse(dir(moveIndex, 'u'), opposite_of($newBoard[moveIndex]), dead)
		dead.concat recurse(dir(moveIndex, 'd'), opposite_of($newBoard[moveIndex]), dead)
		#$dead.delete(moveIndex)

		return (dead || [])
	end

	def clearStones deaths
		return $newBoard if deaths.empty?
		newBoard = Array.new($newBoard)
		deaths.each do |i|
			newBoard[i] = ''
		end
		return newBoard
	end

	private
	def recurse square, target, dead
		return [] if $stop
		if $newBoard[square]== ''
			$stop = true
			return []
		end
		return dead if target == 'R'
		return dead if $newBoard[square] != target
		$newBoard[square] = 'R'
		dead << square
		recurse dir(square, 'l'), target, dead unless $stop
		recurse dir(square, 'r'), target, dead unless $stop
		recurse dir(square, 'u'), target, dead unless $stop
		recurse dir(square, 'd'), target, dead unless $stop
		return $stop ? [] : dead
	end

	def dir index, direction
		dimensions = Math.sqrt($board.size) #19

		case direction
			when 'l'
				return index-1 if index % dimensions != 0
			when 'r'
				return index+1 if index+1 % dimensions != 0
			when 'u'
				return index - dimensions if index >= dimensions
			when 'd'
				return index + dimensions if index < dimensions * (dimensions - 1)
		end
		return index
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

