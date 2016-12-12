require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
	#These tests are mostly useless but provide a template for more useful ones later
	def setup
		@player = Player.new(name: 'Bach', email: 'user@email.com', password: 'pass', password_confirmation: 'pass')
	end

	test "Should be valid" do 
		assert @player.valid?
	end

	test "valid name" do
		@player.name = " "
		assert_not @player.valid?
	end

	test "valid email" do 
		invalids = ['something', 'something.com']
		valids = ['user@email.com, a@b']
		invalids.each do |inv|
			@player.email = inv 
			assert_not @player.valid?, "#{inv.inspect} should be invalid"
		end

		valids.each do |v|
			@player.email = v
			assert @player.valid?, "#{v.inspect} should be valid"
		end
	end

end
