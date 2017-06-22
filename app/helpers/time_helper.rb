module TimeHelper

	def get_new_time last_move_at, this_move_at, time_left, increment
		last_move_at = this_move_at if last_move_at.nil?
		new_time     = time_left - ((this_move_at - last_move_at)*1000) + increment
		new_time     = 0 if new_time < 0
		return new_time
	end


end