import { BasePage } from "./core/BasePage";
import { appRoutes, RouteConfig, RoutePath } from "./routes";
import { isAuthenticated } from "./utils/auth";


interface Router {
  start: () => void;
  navigate: (path: string) => void;
  registerRoutes: (routes: RouteConfig) => void;
}

let currentPage: BasePage | null = null;
let routes: RouteConfig = appRoutes;

export function createRouter(): Router {
  const container = document.getElementById('app') as HTMLElement;
  if (!container){ 
    throw new Error('App container not found');
  }
  async function handleRouteChange() {
    const path = window.location.pathname as RoutePath;
    const currentRoute = routes[path] || routes['*']
    if (path == '/' && !isAuthenticated())
      return navigate('/login')
    if (path == '/' && isAuthenticated())
      return navigate('/dashboard')
    if (currentRoute?.requiresAuth  && !isAuthenticated())
      return navigate('/')
    if (!currentRoute.requiresAuth && isAuthenticated())
      return navigate('/dashboard')
    const PageComponent = currentRoute.page || routes['*'].page;
    if (!PageComponent) {
      console.error('No component found for route');
      return;
    }

    if (currentPage) currentPage.destroy();

    try {
      currentPage = new PageComponent();
      container.innerHTML = 'Loading...';
      const element = await currentPage.mount();
      container.innerHTML = '';
      container.appendChild(element);
      currentPage.disableAnchorLinksLoading(navigate)
    } catch (error) {
      console.error('Mounting failed:', error);
      container.innerHTML = '<h1>Error loading page</h1>';
    }
  }

  function navigate(path: string) {
    if (path !== window.location.pathname) {
      window.history.pushState({}, '', path);
      handleRouteChange();
    }
  }

  function start() {
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('load', handleRouteChange);
    console.log('Router started');
  }

  function registerRoutes(newRoutes: RouteConfig) {
    routes = { ...routes, ...newRoutes };
    console.log('Registered routes:', Object.keys(newRoutes));
  }

  return {
    start,
    navigate,
    registerRoutes
  };
}

// Make router type available for pages
export type RouterType = ReturnType<typeof createRouter>;