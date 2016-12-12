class Player < ApplicationRecord
	validates :name, presence: true, length: {maximum: 16, minimum: 2}, uniqueness: {case_sensitive: false}
	validates :email, presence: true, length: {maximum: 100}, format: { with: /@/ }, uniqueness: {case_sensitive: false}
	validates :password, presence: true, length: {minimum: 6}

	before_save {email.downcase!}

	has_secure_password
end
