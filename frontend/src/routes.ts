import { GamePage } from './components/GamePage';
import { BasePage } from './core/BasePage';
import { DashBoardPage } from './pages/dashboard/DashboardPage';
import { LoginPage } from './pages/login/LoginPage';
import { NotFoundPage } from './pages/not-found/NotFoundPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { UserSettingsPage } from './pages/settings/SettingsPage';

export const API_BASE_URL = 'http://localhost:3000';

export const appRoutes = {
  '/':{ 
      page: LoginPage,
      requiresAuth: false
    },
  '/login':{ 
      page: LoginPage,
      requiresAuth: false
    },
  '/register':{ 
      page: RegisterPage,
      requiresAuth: false
    },
  '/dashboard':{ 
      page: DashBoardPage,
      requiresAuth: true
    },
    '/game': {
    page: GamePage,
    requiresAuth: true,
  },
  '/settings': {
    page: UserSettingsPage,
    requiresAuth: true
  },
  '*':{ 
      page: NotFoundPage,
      requiresAuth: true
    },
};

export type RouteConfig = typeof appRoutes;
export type RoutePath = keyof RouteConfig;
