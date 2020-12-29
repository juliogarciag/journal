Rails.application.routes.draw do
  resources :entries, only: [:update]

  get "/daily-entries/:date" => "daily_entries#show"
end
