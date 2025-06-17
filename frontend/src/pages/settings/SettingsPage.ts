import { UserSettingsForm } from '../../components/UserSettingsForm';
import { BasePage } from '../../core/BasePage';
import { getCurrentUser } from '../../utils/auth';
import { UserService } from '../../api/users';
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
      const formElement = this.form.mount();
      formContainer.appendChild(formElement);
        // Listen for the user-update event
      formElement.addEventListener('user-update', (e: Event) => {
        const customEvent = e as CustomEvent;
        this.handleUserUpdate(customEvent.detail);
      });
      
      return formContainer;
    }
  }
  
  private async handleUserUpdate(userData: any) {
    try {
      const user = getCurrentUser();
      if (!user) {
        alert('User not found. Please login again.');
        this.navigateTo('/login');
        return;
      }
      
      // Show loading state
      const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';
      }
      
      // Call the update API
      const updatedUser = await UserService.updateUser(user.id, userData);
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Show success message
      alert('Profile updated successfully!');
      
      // Optionally redirect to dashboard
      this.navigateTo('/dashboard');
      
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update profile. Please try again.');
    } finally {      // Reset button state
      const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Save Changes';
      }
    }
  }
}