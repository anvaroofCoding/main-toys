import 'antd/dist/reset.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { store } from './app/store'
import Login from './auth/login'
import './index.css'
import Allp from './pages/Allp'
import Home from './pages/home'
import Order from './pages/order'
import Profile from './pages/profile'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<App />}>
						<Route path='/' element={<Home />} />
						<Route path='/barcha-maxsulotlar' element={<Allp />} />
						<Route path='/buyurtmalar' element={<Order />} />
						<Route path='/shaxsiy-kabinet' element={<Login />} />
						<Route path='/maxsulotlar-kabinet' element={<Profile />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	</StrictMode>
)
