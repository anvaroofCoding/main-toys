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
import Category from './pages/category'
import Checkout from './pages/checkout'
import Home from './pages/home'
import MyOrder from './pages/my_order'
import Order from './pages/order'
import ProductDetails from './pages/product-details'
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
						<Route
							path='/buyurtmalar/product/:id'
							element={<ProductDetails />}
						/>
						<Route path='/checkout' element={<Checkout />} />
						<Route path='/my-order' element={<MyOrder />} />
						<Route path='/sozlamalar' element={<Category />} />
						<Route path='/shaxsiy-kabinet' element={<Profile />} />
					</Route>
					<Route path='/login' element={<Login />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</StrictMode>
)
