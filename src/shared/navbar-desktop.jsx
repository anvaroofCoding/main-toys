import { useGetCardProductsQuery } from '@/service/api'
import { motion } from 'framer-motion'
import { Home, ListOrdered, Search, ShoppingCart, User } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const DesktopNavbar = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const pathname = location.pathname
	const { data, isLoading } = useGetCardProductsQuery()
	const handleClick = () => {
		navigate('/barcha-maxsulotlar?need_thing=${token}', {
			state: { openSearch: true },
		})
	}
	const token = localStorage.getItem('access_token')

	const navItems = [
		{ name: 'Bosh sahifa', icon: Home, link: `/?need_thing=${token}` },
		{
			name: 'Maxsulotlar',
			icon: ListOrdered,
			link: `/barcha-maxsulotlar?need_thing=${token}`,
		},
		{
			name: 'Kategoriyalar',
			icon: Search,
			link: `/sozlamalar?need_thing=${token}`,
		},
		{
			name: 'Buyurtmalar',
			icon: ShoppingCart,
			link: `/buyurtmalar?need_thing=${token}`,
			badge: isLoading ? 0 : data?.length || 0,
		},
		{
			name: token ? 'Profil' : 'Login',
			icon: User,
			link: token ? `/shaxsiy-kabinet?need_thing=${token}` : '/login',
		},
	]

	return (
		<ul className='fixed top-0 left-0 right-0 z-50 bg-white/95 flex justify-center items-center gap-4 h-20 '>
			<div className='flex items-center gap-3 w-full max-w-[900px] justify-center'>
				{navItems.map((item, index) => {
					const isActive = pathname === item.link
					const Icon = item.icon

					return (
						<motion.li
							key={item.name}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<Link to={item.link}>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className={`relative flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
										isActive
											? 'bg-blue-50 text-blue-600'
											: 'text-gray-600 hover:bg-gray-50'
									}`}
								>
									<motion.div
										animate={
											isActive
												? {
														scale: [1, 1.2, 1],
														rotate: [0, 5, -5, 0],
												  }
												: {}
										}
										transition={{ duration: 0.5 }}
										className='relative'
									>
										<Icon className='w-5 h-5' />
										{item.badge > 0 && (
											<motion.span
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className='absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-lg min-w-[20px] text-center'
											>
												{item.badge}
											</motion.span>
										)}
									</motion.div>

									<span className='font-medium text-sm whitespace-nowrap'>
										{item.name}
									</span>

									{isActive && (
										<motion.div
											layoutId='desktop-navbar-indicator'
											className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full'
											transition={{
												type: 'spring',
												stiffness: 380,
												damping: 30,
											}}
										/>
									)}

									{!isActive && (
										<motion.div
											className='absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 rounded-lg opacity-0'
											whileHover={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
										/>
									)}
								</motion.div>
							</Link>
						</motion.li>
					)
				})}

				{/* Search button — o‘ng tomonda */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					className='flex items-center'
				>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleClick}
						className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
					>
						<Search className='w-5 h-5 text-gray-600' />
					</motion.button>
				</motion.div>
			</div>
		</ul>
	)
}

export default DesktopNavbar
