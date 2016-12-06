class Game < ApplicationRecord
	serialize :history, JSON
end
