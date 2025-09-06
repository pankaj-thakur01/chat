import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '../context/Authcontext.jsx'
import { ChatProvider } from '../context/Chatcontext.jsx'


createRoot(document.getElementById('root')).render(
<AuthProvider>
<ChatProvider>

    <App />

</ChatProvider>

</AuthProvider>

)
