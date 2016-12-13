Rails.application.routes.draw do

	root 'home#index'

	get '/signup', to: 'players#new'
	post '/signup',  to: 'players#create'

	get '/login', to: 'sessions#new'
	post '/login', to: 'sessions#create'
	delete '/logout', to: 'sessions#destroy'

	resources :players, path: 'u'
	resources :games, path: 'g'
	# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
