import { DashBoardPage } from './pages/dashboard/DashboardPage';
import { LoginPage } from './pages/home-page/HomePage';
import { NotFoundPage } from './pages/not-found/NotFoundPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';

export const appRoutes = {
  '/': LoginPage,
  '/register': RegisterPage,
  '/dashboard':DashBoardPage,
  '*': NotFoundPage
};