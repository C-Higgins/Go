require 'test_helper'

class PlayersEditTest < ActionDispatch::IntegrationTest
	def setup
		@user = players(:testUser1)
	end

	test "Password cannot be edited with bad params" do
		log_in_as @user, 'password'
		get settings_path
		assert_template 'players/edit'
		patch settings_path, params: { player: {password: "foo", password_confirmation: "foo" } }
	    assert_template 'players/edit'
	    delete logout_path
	    log_in_as @user, 'password'

	    assert is_logged_in?                                      
	end

	test "Password can be edited" do
		log_in_as @user, 'password'
		get settings_path
		assert_template 'players/edit'
		patch settings_path, params: { player: {password: "newpassword", password_confirmation: "newpassword" } }
		assert_redirected_to @user
		delete logout_path
		log_in_as @user, 'password'
		assert_not is_logged_in?  
		log_in_as @user, 'newpassword'
		assert is_logged_in?  
	end

end
