Rails.application.routes.draw do
  resources :entries, only: [:update]
  resources :entry_types, only: [:index, :update, :create, :destroy] do
    member do
      patch :move
      get :can_be_deleted
    end
  end

  get "/daily-entries/:date" => "daily_entries#show"
end
