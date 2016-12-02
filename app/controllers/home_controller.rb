class HomeController < ApplicationController
  def index
  	@games = Game.all
  end
end
