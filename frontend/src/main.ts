// API Service
const API = {
  async getHealth() {
    const response = await fetch('/health')
    if (!response.ok) throw new Error('API Health check failed')
    return response.json()
  },
  
  async login(email: string, password: string) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) throw new Error('Login failed')
    return response.json()
  }
}

// App Logic
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = (document.getElementById('email') as HTMLInputElement).value
  const password = (document.getElementById('password') as HTMLInputElement).value
  
  try {
    const result = await API.login(email, password)
    localStorage.setItem('token', result.access_token)
    alert('Login successful!')
    console.log('User:', result.user)
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Login failed')
  }
})

// Test connection on load
API.getHealth()
  .then(data => console.log('Backend health:', data))
  .catch(err => console.error('Backend connection failed:', err))