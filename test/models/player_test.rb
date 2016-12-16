require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
	def setup
		@player = Player.new(name: 'Bach', email: 'user@email.com', password: 'password', password_confirmation: 'password')
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

	test "email duplication" do
		p2 = @player.dup
		@player.save
		p2.email = @player.email.upcase
		assert_not p2.valid?
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

	test "emails should be saved in lowercase" do 
		e = 'EmaIL@exaMple.com'
		@player.email = e
		@player.save
		assert_equal e.downcase, @player.reload.email
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
