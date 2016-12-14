require 'test_helper'

class UsersSignupTest < ActionDispatch::IntegrationTest
	test "invalid signup info results in no new user" do
		get signup_path
		assert_no_difference 'Player.count' do
			post players_path, params: { player: { name:  "",
			                                         email: "user@invalid",
			                                         password:              "foo",
			                                         password_confirmation: "bar" } }
        end
        assert_template 'players/new'
    end

    test "valid signup results in new user" do 
		get signup_path
		assert_difference 'Player.count', 1 do
			post players_path, params: { player: { name:  "Joe",
			                                         email: "email@example.com",
			                                         password:              "password1",
			                                         password_confirmation: "password1" } }
		end
		follow_redirect!
		assert_template 'players/show'
	end
end
