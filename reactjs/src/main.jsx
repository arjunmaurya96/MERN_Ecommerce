// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'

// import App from './App.jsx'
// import './index.css'

// /* ---------- CONTEXT ---------- */
// import { AuthProvider } from './context/AuthContext'

// /* ---------- JS & CSS ---------- */
// import '../public/js/main.js'
// import 'owl.carousel/dist/assets/owl.carousel.min.css'
// import 'owl.carousel'
// import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
// import '../node_modules/bootstrap-icons/font/bootstrap-icons.css'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>
// )


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'

/* ---------- GOOGLE LOGIN ---------- */
import { GoogleOAuthProvider } from '@react-oauth/google'

import '../public/js/main.js'
import 'owl.carousel/dist/assets/owl.carousel.min.css'
import 'owl.carousel'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="557464938497-cg6r36q07juaqcpdhqak8s5l6kb0me93.apps.googleusercontent.com">
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
)
