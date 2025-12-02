import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import FloatingCallButton from './components/fixedButton'
import Footer from './shared/footer'
import ResponsiveNavbar from './shared/navbar-responsive'

const App = () => {

	const urlParams = new URLSearchParams(window.location.search);
	const tokenFromUrl = urlParams.get("need_thing");
	if (tokenFromUrl) {
    localStorage.setItem("access_token", tokenFromUrl);
}
	const [toastPosition, setToastPosition] = useState('bottom-right')

	useEffect(() => {
		const updatePosition = () => {
			if (window.innerWidth <= 640) {
				setToastPosition('top-center') // mobile
			} else {
				setToastPosition('bottom-right') // desktop
			}
		}

		updatePosition()
		window.addEventListener('resize', updatePosition)

		return () => window.removeEventListener('resize', updatePosition)
	}, [])

	return (
		<div className='roboto'>
			<Toaster position={toastPosition} richColors closeButton />
			<ResponsiveNavbar />
			<Outlet />
			<FloatingCallButton />
			<Footer />
		</div>
	)
}

export default App
