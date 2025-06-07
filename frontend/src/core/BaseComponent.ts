// src/components/base-component.ts
export abstract class BaseComponent<PropsType = any> {
  protected element: HTMLElement;
  protected props: PropsType;

  constructor(props: PropsType) {
    this.props = props;
    this.element = document.createElement('div'); // Default container
  }

  // Must be implemented by child components
  protected abstract render(): string;

  // Public method to get the DOM element
  public mount(): HTMLElement {
    this.element.innerHTML = this.render();
    this.setupEventListeners();
    return this.element;
  }

  // Optional event listener setup
  protected setupEventListeners(): void {}

  // Helper to dispatch custom events
  protected emit(eventName: string, detail?: any): void {
    this.element.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        detail
      })
    );
  }

  // Cleanup method
  public destroy(): void {
    this.element.innerHTML = '';
  }
}