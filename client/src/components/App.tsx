import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "pages/HomePage";
import SettingsPage from "pages/SettingsPage";
import Sidebar from "./Sidebar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="grid grid-cols-12">
          <aside className="col-span-3">
            <Sidebar />
          </aside>
          <section className="col-span-9" role="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </section>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
