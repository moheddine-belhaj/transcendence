import { AuthService } from '../../api';
import { BasePage } from '../../core/BasePage';
import template from './register-page.html'

interface RegisterFormData{
  name:string;
  password:string;
  email:string;
}

export class RegisterPage extends BasePage {

  registerForm:RegisterFormData={
    name:'',
    password:'',
    email:''
  }
  confirmPassword:string=''

  protected async loadTemplate(): Promise<string> {
    return template
  }

  protected initEventListeners(): void {
    this.querySelector('#name')?.addEventListener('change', (e) => {
      this.registerForm.name = (e.target as HTMLInputElement).value.trim()
    });
    this.querySelector('#email')?.addEventListener('change', (e) => {
      this.registerForm.email = (e.target as HTMLInputElement).value.trim()
    });
    this.querySelector('#password')?.addEventListener('change', (e) => {
      this.registerForm.password = (e.target as HTMLInputElement).value
    });
    this.querySelector('#confirm-password')?.addEventListener('change', (e) => {
      this.confirmPassword = (e.target as HTMLInputElement).value
    });
    this.querySelector('form')?.addEventListener('submit', async (e)=>{
      e.preventDefault()
     await this.handleSubmit()
    })
  }

  private async handleSubmit(){
    if (!this.validate())
    {  
      alert("Passwords do'nt match")
      return
    }
     try {
        const response = await AuthService.register(this.registerForm);
      if (response.id)
      {
          alert("User registered succesfuly you can now sign in !")
            this.navigateTo('/login')
        }
      } catch (error) {
        alert('Something went wrong ! could not register user')
      }
    }
  

  private validate():boolean{
    return this.registerForm.password == this.confirmPassword
  }
}