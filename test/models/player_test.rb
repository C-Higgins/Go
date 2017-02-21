require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
	def setup
		@player = Player.new(name: 'Bach', password: 'password', password_confirmation: 'password')
	end

	test "Should be valid" do 
		assert @player.valid?
	end

	test "name validity" do
		invalid_names = [' ', 'A', '']
		invalid_names.each do |n|
			@player.name = n
			assert_not @player.valid?
		end
	end

	test "name duplication" do
		p2 = @player.dup
		@player.save
		p2.name = @player.name.upcase
		assert_not p2.valid?
	end

	test "Password not blank" do 
		@player.password = @player.password_confirmation = ' ' * 8
		assert_not @player.valid?
	end

	test "Password min length" do 
		@player.password = @player.password_confirmation = 'a' * 5
		assert_not @player.valid?
		@player.password = @player.password_confirmation = 'a' * 6
		assert @player.valid?
	end


























end
