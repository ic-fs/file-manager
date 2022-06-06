import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageLoading } from "./Loading.jsx";

const StorefrontPage = lazy(() =>
  import("./Pages/StorefrontPage.jsx").then((m) => ({
    default: m.StorefrontPage,
  }))
);

const BoxesPage = lazy(() =>
  import("./Pages/Boxes/BoxesPage.jsx").then((m) => ({
    default: m.BoxesPage,
  }))
);

const BoxPage = lazy(() =>
  import("./Pages/Boxes/BoxPage.jsx").then((m) => ({
    default: m.BoxPage,
  }))
);

export function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <BrowserRouter>
        <Routes>
          <Route index element={<StorefrontPage />} />

          <Route path="boxes" element={<BoxesPage />} />

          <Route path=":canisterId/*" element={<BoxPage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}
