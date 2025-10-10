import { Outlet } from 'react-router-dom'
import FloatingCallButton from './components/fixedButton'
import Navbar from './shared/navbar'

const App = () => {
	return (
		<div>
			<Outlet />
			<Navbar />
			<FloatingCallButton />
		</div>
	)
}

export default App
