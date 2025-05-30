import { BasePage } from '../../core/BasePage'
export class NotFoundPage extends BasePage {
  protected async loadTemplate(): Promise<string> {
    return `
      <div class="not-found">
        <h1>404 - Page Not Found</h1>
        <a href="/" id="home-link">Return to Home</a>
      </div>
    `;
  }

  protected initEventListeners(): void {
    this.querySelector('#home-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }
}