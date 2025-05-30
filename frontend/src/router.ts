import { BasePage } from "./core/BasePage";
import { appRoutes } from "./routes";

type RouteHandler = new () => BasePage;
type Routes = Record<string, RouteHandler>;

interface Router {
  start: () => void;
  navigate: (path: string) => void;
  registerRoutes: (routes: Routes) => void;
}

let currentPage: BasePage | null = null;
let routes: Routes = appRoutes;

export function createRouter(): Router {
  const container = document.getElementById('app') as HTMLElement;
  if (!container){ 
    throw new Error('App container not found');
  }
  async function handleRouteChange() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    console.log(`Routing to: ${path}`);

    const PageComponent = routes[path] || routes['*'];
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

  function registerRoutes(newRoutes: Routes) {
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