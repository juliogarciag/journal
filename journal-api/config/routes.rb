Rails.application.routes.draw do
  resources :entries, only: [:update]
  resources :entry_types, only: [:index, :update]

  get "/daily-entries/:date" => "daily_entries#show"
end
