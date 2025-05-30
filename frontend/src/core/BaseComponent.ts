// src/components/base-component.ts
export abstract class BaseComponent<PropsType = any> {
  protected element: HTMLElement;
  protected props: PropsType;

  constructor(props: PropsType) {
    this.props = props;
    this.element = document.createElement('div');
  }

  // Must be implemented by child components
  abstract render(): HTMLElement;

  // Helper method to dispatch custom events
  protected dispatchEvent(eventName: string, detail?: any) {
    this.element.dispatchEvent(
      new CustomEvent(eventName, { 
        bubbles: true,
        detail 
      })
    );
  }

  // Cleanup method
  destroy() {
    this.element.remove();
  }
}