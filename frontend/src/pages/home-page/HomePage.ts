import { BasePage } from '../../core/BasePage';
import template from './home-page.html'
import { AuthService } from '../../api';


interface LoginFormData {
  email:string;
  password:string;
}

export class LoginPage extends BasePage {

  private loginForm:LoginFormData = {
    email: "",
    password:"",
  }

  protected async loadTemplate(): Promise<string> {
    return template
  }

  protected initEventListeners(): void {
    this.querySelector('#email')?.addEventListener('change', (e) => {
      this.loginForm.email = (e.target as HTMLInputElement).value.trim()
    });
    this.querySelector('#password')?.addEventListener('change', (e) => {
      this.loginForm.password = (e.target as HTMLInputElement).value
    });
    this.querySelector('form')?.addEventListener('submit', async (e)=>{
      e.preventDefault()
     await this.handleSubmit()
    })
  }

  private async handleSubmit(){
    try {
          const result = await AuthService.login(this.loginForm.email, this.loginForm.password);
          if (!result.access_token) {
            throw new Error('Access token missing from login response');
          }
          localStorage.setItem('token', result.access_token);
          localStorage.setItem('user', JSON.stringify(result.user));
          this.navigateTo('/dashboard')
        }
      catch(e){
        alert("Could not login with these credentials")
      }
  }
}