import { Routes, Route } from "react-router-dom";
import TimerPage from "./views/TimerPage";
import ErrorPage from "./views/ErrorPage";
import { NotFound } from "./views/NotFoundPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<TimerPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}