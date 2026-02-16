import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './components/common/Loader';
import PrivateRoute from './components/common/PrivateRoute';
import { privateRoutes, publicRoutes } from './utils/app.route';

type RouteObject = {
  path: string;
  element: React.ReactNode;
};

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const renderRoutes = (routes: RouteObject[]) => {
    return routes.map((r: RouteObject) => (
      <Route path={r.path} element={r.element} key={r.path} />
    ));
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen">
      <Routes>
        <Route element={<PrivateRoute />}>
          {renderRoutes(privateRoutes)}
        </Route>
        <Route>{renderRoutes(publicRoutes)}</Route>
      </Routes>
    </div>
  );
}

export default App;
