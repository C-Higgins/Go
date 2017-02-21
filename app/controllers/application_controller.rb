class ApplicationController < ActionController::Base
	protect_from_forgery with: :exception
	include SessionsHelper
	before_action Proc.new { current_user unless @current_user }
end
