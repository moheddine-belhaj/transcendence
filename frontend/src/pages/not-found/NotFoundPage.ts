import { BasePage } from '../../core/BasePage'
import template from './not-found-page.html'

export class NotFoundPage extends BasePage {
  protected async loadTemplate(): Promise<string> {
    return template
  }

  protected initEventListeners(): void {
    this.querySelector('#home-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }
}