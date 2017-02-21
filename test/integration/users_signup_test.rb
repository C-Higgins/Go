require 'test_helper'

class UsersSignupTest < ActionDispatch::IntegrationTest
	test "invalid signup info results in no new user" do
		get signup_path
		assert_no_difference 'Player.count' do
		post signup_path, params: { player: { name:  "",
			                                         password:              "foo",
			                                         password_confirmation: "bar" } }
        end
        assert_template 'players/new'
    end

    test "valid signup results in new user" do 
		get signup_path
		assert_difference 'Player.count', 1 do
		post signup_path, params: { player: { name:  "Joe",
			                                         password:              "password1",
			                                         password_confirmation: "password1" } }
		end
		follow_redirect!
		assert is_logged_in? Player.last
		assert_template 'players/show'
	end
end
