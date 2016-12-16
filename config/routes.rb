Rails.application.routes.draw do

	root 'home#index'

	get '/signup', to: 'players#new'
	post '/signup',  to: 'players#create'

	get '/login', to: 'sessions#new'
	post '/login', to: 'sessions#create'
	delete '/logout', to: 'sessions#destroy'

	get '/settings', to: 'players#edit'
	patch '/settings', to: 'players#update'

	resources :players, path: 'u', param: :name, only: [:index, :show]
	resources :games, path: 'g', param: :webid
	# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
