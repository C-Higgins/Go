require 'test_helper'

class UserControllerTest < ActionDispatch::IntegrationTest
	def setup
		@player = players(:testUser1)
		@player2 = players(:testUser2)
	end

	test "Cannot signup while logged in" do 
		log_in_as @player
		get signup_path
		assert_redirected_to @player
	end

	test "Cannot change settings when not logged in" do 
		get settings_path
		assert_redirected_to login_path

		patch settings_path(@player), params: { player: { password: 'newpassword', password_confirmation: 'newpassword' } }
		assert_redirected_to login_path
	end

	test "Cannot change another user's settings" do 
		log_in_as @player
		patch settings_path(@player2), params: { player: { password: 'newpassword', password_confirmation: 'newpassword' } }
		delete logout_path
		log_in_as @player2, 'newpassword'
		assert_not is_logged_in?
	end

	test "Redirected to correct page after requiring login" do 
		get settings_path
		log_in_as @player
		assert_redirected_to settings_path
	end
end
