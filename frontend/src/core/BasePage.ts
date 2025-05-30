import { createRouter } from "../router";

export abstract class BasePage {
  protected container: HTMLElement;
  protected template: string = '';
  
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'page-container';
  }

  protected abstract loadTemplate(): Promise<string>;

  async mount(): Promise<HTMLElement> {
    try {
      this.template = await this.loadTemplate();
      this.container.innerHTML = this.template;
      this.initEventListeners();
      return this.container;
    } catch (error) {
      console.error('Template loading failed:', error);
      this.container.innerHTML = '<h1>Page load error</h1>';
      return this.container;
    }
  }

  protected initEventListeners(): void {
    // To be overridden by child classes
  }

  destroy(): void {
    this.container.innerHTML = '';
  }

  protected querySelector(selector: string): HTMLElement | null {
    return this.container.querySelector(selector);
  }

  public disableAnchorLinksLoading(navigate: (p:string)=>void){
      document.querySelectorAll('a').forEach((a)=>{
        a.addEventListener('click', (e)=>{
          e.preventDefault()
          navigate(a.href)
        })
      })
  }

  protected navigateTo(path:string){
    const {navigate} = createRouter()
    navigate(path)
  }
}