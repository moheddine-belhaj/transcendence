import { UserSettingsForm } from '../../components/UserSettingsForm';
import { BasePage } from '../../core/BasePage';
import { getCurrentUser } from '../../utils/auth';
import template from './settings-page.html'

export class UserSettingsPage extends BasePage {

    form : UserSettingsForm
  confirmPassword:string = ''
  constructor(){
    super()
    const user = getCurrentUser()
    const userSettingForm = {
        username: user?.name || '',
        email: user?.email || '',
        avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fsbcf.fr%2Fen%2Fdefault-avatar%2F&psig=AOvVaw2508cFjeXAs5DAnjyof1L9&ust=1748974094385000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCICNmbOq040DFQAAAAAdAAAAABAE',
    }
    this.form = new UserSettingsForm(userSettingForm)
  }
  protected async loadTemplate(): Promise<string> {
    return template
  }
  
async mount(): Promise<HTMLElement> {
    const element = await super.mount();
    this.displayForm()
    return element
  }
  protected initEventListeners(): void {

  }

  displayForm(){
    const formContainer = this.container.querySelector('#form-container');
    if (formContainer) {
      formContainer.appendChild(this.form.mount());
    return formContainer;
  }

//   private async handleSubmit(){
//     try {
//           const result = await AuthService.login(this.loginForm.email, this.loginForm.password);
//           if (!result.access_token) {
//             throw new Error('Access token missing from login response');
//           }
//           localStorage.setItem('token', result.access_token);
//           localStorage.setItem('user', JSON.stringify(result.user));
//           this.navigateTo('/dashboard')
//         }
//       catch(e){
//         alert("Could not login with these credentials")
//       }
  }
}