
import { BaseComponent } from '../core/BaseComponent';

type WelcomeBannerProps = {
  username: string;
};

export class WelcomeBanner extends BaseComponent<WelcomeBannerProps> {
  protected render(): string {
    return `<div class="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-600">
              <h2 class="text-xl font-bold text-gray-800 mb-2">Welcome back, ${this.props.username}!</h2>
              <p class="text-gray-600">Ready for your next ping pong match?</p>
            </div>
        `;
  }

  protected setupEventListeners(): void {

  }
}