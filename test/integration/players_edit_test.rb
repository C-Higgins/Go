require 'test_helper'

class PlayersEditTest < ActionDispatch::IntegrationTest
	def setup
		@user = players(:testUser1)
	end

	test "Password cannot be edited with bad params" do
		get login_path
		post login_path, params: { session: { email:    @user.email,
		                                      password: 'password' } }
		get settings_path
		assert_template 'players/edit'
		patch settings_path, params: { player: {password: "foo", password_confirmation: "bar" } }
	    assert_template 'players/edit'
	    delete logout_path
	    post login_path, params: { session: { email:    @user.email,
	                                          password: 'password' } }

	    assert is_logged_in?                                      
	end

	test "Password can be edited" do
		get login_path
		post login_path, params: { session: { email:    @user.email,
		                                      password: 'password' } }
		get settings_path
		assert_template 'players/edit'
		patch settings_path, params: { player: {password: "newpassword", password_confirmation: "newpassword" } }
		assert_redirected_to @user
		delete logout_path
		post login_path, params: { session: { email:    @user.email,
		                                      password: 'password' } }

		assert_not is_logged_in?  
		post login_path, params: { session: { email:    @user.email,
		                                      password: 'newpassword' } }
		assert is_logged_in?  
	end

end
