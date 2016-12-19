class Player < ApplicationRecord
	has_many :involvements, inverse_of: :player
	has_many :games, through: :involvements

	validates :name, presence: true, length: {maximum: 16, minimum: 2}, uniqueness: {case_sensitive: false}
	validates :email, presence: true, length: {maximum: 100}, format: { with: /@/ }, uniqueness: {case_sensitive: false}
	validates :password, presence: true, length: {minimum: 6}, allow_nil: true

	before_save {email.downcase!}

	has_secure_password

	attr_accessor :remember_token


	# Returns the hash digest of the given string.
	def Player.digest(string)
		cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
		BCrypt::Password.create(string, cost: cost)
	end


	def Player.new_token
		SecureRandom.urlsafe_base64
	end

	# Remembers a user in the database for use in persistent sessions.
	def remember
		self.remember_token = Player.new_token
		update_attribute(:remember_digest, Player.digest(remember_token))
	end

	def forget
		update_attribute(:remember_digest, nil)
	end

	#return true if given token matches the digest
	def authenticated? remember_token
		return false if remember_digest.nil?
		BCrypt::Password.new(remember_digest).is_password?(remember_token)
	end

	# This makes helpers such as player_path(player) redirect to /u/:name
	# instead of the default, /u/:id
	def to_param
		self.name
	end
end
