# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    if Rails.env.development?
      origins [
        %r{https?://localhost(:[0-9]+)?/?\z},
        %r{https?://192.168.1.[0-9]+(:[0-9]+)?/?\z},
      ]
    elsif Rails.env.production?
      origins [
        %r{http://monkey-journal.herokuapp.com},
      ]
    end

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
