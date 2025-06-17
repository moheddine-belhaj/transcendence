
import { BaseComponent } from '../core/BaseComponent';

type UserSettingsFormProps = {
  username: string;
  email: string;
  avatar:string;
};

type Form = {
    username:string;
    email:string;
    avatar:string;
    password?:string;
}

export class UserSettingsForm extends BaseComponent<UserSettingsFormProps> {
private form:Form={
    username : this.props.username,
    email: this.props.email,
    avatar: this.props.avatar
}
private confirmPassword:string="";
  
  protected render(): string {
    return `            <!-- Profile Form -->
            <form class="p-6 space-y-6">
                <!-- Avatar Upload -->
                <div class="flex flex-col items-center">
                    <div class="relative mb-4">
                        
                    </div>
                   
                </div>

                <!-- Name -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        value="${this.props.username}" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value="${this.props.email}" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        required
                    >
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Leave blank to keep current"
                    >
                    <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                        type="password" 
                        id="confirm-password" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Leave blank to keep current"
                    >
                </div>

                <!-- Form Actions -->
                <div class="flex justify-between pt-4">
                    <a href="/dashboard" class="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-50 transition duration-200">
                        Cancel
                    </a>
                    <button
                        type="submit" 
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        `;
  }
  protected setupEventListeners(): void {
    this.element.querySelector("#name")?.addEventListener("change", (e)=>{
        this.form.username = (e.target as HTMLInputElement).value
    })
    this.element.querySelector("#email")?.addEventListener("change", (e)=>{
        this.form.email = (e.target as HTMLInputElement).value
    })
    this.element.querySelector("#password")?.addEventListener("change", (e)=>{
        this.form.password = (e.target as HTMLInputElement).value
    })
    this.element.querySelector("#confirm-password")?.addEventListener("change", (e)=>{
        this.confirmPassword = (e.target as HTMLInputElement).value
        console.log(this.confirmPassword);
    })
    this.element.querySelector("form")?.addEventListener("submit", (e)=>{
        e.preventDefault()
        
        // Validate passwords match if password is being changed
        if (this.form.password && this.form.password !== this.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Emit custom event with form data
        const updateEvent = new CustomEvent('user-update', {
            detail: {
                name: this.form.username,
                email: this.form.email,
                password: this.form.password || undefined // Only include password if provided
            }
        });
        this.element.dispatchEvent(updateEvent);
    })
  }
}