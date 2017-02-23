require_relative 'boot'

require 'rails/all'
require 'sprockets/es6'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Go
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Rails.application.configure do
    #   config.npm.enable_watch                = Rails.env.development?
	#
    #   # Command to install dependencies
    #   config.npm.install                     = ['npm install']
	#
	#
    #   # If 'true', runs 'npm install' on 'rake assets:precompile'. (v1.6.0+)
    #   # This is generally desired, but you may set this to false when
    #   # deploying to Heroku to speed things up.
    #   config.npm.install_on_asset_precompile = true
    # end
  end
end
