Rails.application.routes.draw do
  get 'home/index'
  root 'home#index'
  get '/signup', to: 'players#new'
  post '/signup',  to: 'players#create'

  resources :players, path: 'u'
  resources :games, path: 'g'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
