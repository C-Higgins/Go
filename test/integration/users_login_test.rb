require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest
	def setup
		@user = players(:testUser1)
	end

	test "Valid login and logout works" do
		get login_path
		post login_path, params: { session: { email:    @user.email,
		                                      password: 'password' } }
		assert_redirected_to @user
		follow_redirect!

		# Login goes to the user page and shows correct nav links
		assert is_logged_in?
		assert_template 'players/show'
		assert_select "a[href=?]", signup_path, count: 0
		assert_select "a[href=?]", login_path, count: 0
		assert_select "a[href=?]", logout_path
		assert_select "a[href=?]", player_path(@user)

		# Correct nav links persist after changing pages
		get root_path
		assert is_logged_in?
		assert_template 'games/index'
		assert_select "a[href=?]", signup_path, count: 0
		assert_select "a[href=?]", login_path, count: 0
		assert_select "a[href=?]", logout_path
		assert_select "a[href=?]", player_path(@user)

		#Logout 
		delete logout_path
		assert_not is_logged_in?
		assert_redirected_to root_url
		delete logout_path # Simulate multiple browser situation
		follow_redirect!
		assert_select "a[href=?]", login_path
		assert_select "a[href=?]", logout_path, count: 0
		assert_select "a[href=?]", player_path(@user), count: 0
	end
end
