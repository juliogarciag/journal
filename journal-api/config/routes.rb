Rails.application.routes.draw do
  resources :entries, only: [:update]
  resources :entry_types, only: [:index, :update] do
    member do
      patch :move
    end
  end

  get "/daily-entries/:date" => "daily_entries#show"
end
