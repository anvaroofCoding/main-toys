import { Outlet } from 'react-router-dom'
import Navbar from './shared/navbar'

const App = () => {
	return (
		<div>
			<Outlet />
			<Navbar />
		</div>
	)
}

export default App
