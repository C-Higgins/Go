require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
	
	test "login page exists" do
		get login_path
		assert_response :success
	end

	test "logging in works for invalid info" do
		get login_path
		assert_template 'sessions/new'
		post login_path, params: { session: { email: "", password: "" } }
		assert_template 'sessions/new'
		assert_not flash.empty?
		get root_path
		assert flash.empty?
	end

end
