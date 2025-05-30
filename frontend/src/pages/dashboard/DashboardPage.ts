import { BasePage } from '../../core/BasePage';
import template from './dashboard-page.html'

export class DashBoardPage extends BasePage {

  protected async loadTemplate(): Promise<string> {
    return template
  }

  protected initEventListeners(): void {
    // this.querySelector('#test-button')?.addEventListener('click', () => {
    //   console.log('Button clicked!');
    //   alert('Routing works!');
    // });
  }
}