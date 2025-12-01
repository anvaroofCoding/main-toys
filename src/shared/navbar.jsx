import { useGetCardProductsQuery } from '@/service/api'
import { motion } from 'framer-motion'
import { House, ListOrdered, Search, ShoppingCart, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
	const { pathname } = useLocation()
	const { data, isLoading } = useGetCardProductsQuery()
	const token = localStorage.getItem('access_token')

	const navItems = [
		{ name: 'Bosh sahifa', icon: House, link: '/' },
		{ name: 'Maxsulotlar', icon: ListOrdered, link: '/barcha-maxsulotlar' },
		{ name: 'Kategoriyalar', icon: Search, link: '/sozlamalar' },
		{
			name: 'Buyurtmalar',
			icon: ShoppingCart,
			link: '/buyurtmalar',
			badge: isLoading ? '' : data?.length,
		},
		{
			name: token ? 'Profil' : 'Login',
			icon: User,
			link: token ? '/shaxsiy-kabinet' : '/login',
		},
	]

	return (
		<nav className='fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-[0_-1px_10px_rgba(0,0,0,0.1)] border-t border-gray-100'>
			<ul className='flex justify-around items-center pt-3'>
				{navItems.map(item => {
					const isActive = pathname === item.link
					const Icon = item.icon

					return (
						<Link
							key={item.name}
							to={item.link}
							className='relative flex flex-col items-center justify-center text-xs text-gray-500 transition-all duration-200'
						>
							{/* Animatsiya effekti */}
							<motion.div
								whileTap={{ scale: 0.9 }}
								className='relative flex flex-col items-center'
							>
								<Icon
									className={`w-6 h-6 transition-all duration-200 ${
										isActive ? 'text-blue-500 scale-110' : 'text-gray-400'
									}`}
								/>

								{/* Badge */}
								{item.badge > 0 && (
									<span className='absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md'>
										{item.badge}
									</span>
								)}
							</motion.div>

							{/* Label */}
							<span
								className={`mt-1 font-medium ${
									isActive ? 'text-blue-600' : 'text-gray-500'
								}`}
							>
								{item.name}
							</span>

							{/* Aktive indikator */}
							{isActive && (
								<motion.div
									layoutId='navbar-indicator'
									className='absolute -bottom-1 h-[3px] w-6 rounded-full bg-blue-500'
								/>
							)}
						</Link>
					)
				})}
			</ul>
		</nav>
	)
}

export default Navbar
