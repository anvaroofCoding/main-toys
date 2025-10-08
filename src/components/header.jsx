import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SButton from './Cbutton'

export default function Header() {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		setIsVisible(true)
	}, [])

	const marsToysLetters = [
		{ letter: 'M', color: 'text-blue-500' },
		{ letter: 'A', color: 'text-red-500' },
		{ letter: 'R', color: 'text-yellow-500' },
		{ letter: 'S', color: 'text-green-500' },
		{ letter: ' ', color: '' },
		{ letter: 'T', color: 'text-blue-500' },
		{ letter: 'O', color: 'text-red-500' },
		{ letter: 'Y', color: 'text-yellow-500' },
		{ letter: 'S', color: 'text-green-500' },
	]

	return (
		<div>
			<div className="min-h-screen relative bg-[url('/toyschi.jpg')] bg-cover bg-center overflow-hidden">
				<div className='bg-black/50 w-full h-full absolute'></div>

				{/* Apple-like animated background */}
				<div className='absolute inset-0'>
					<div className='absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse'></div>
					<div className='absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000'></div>
				</div>

				{/* Grid lines */}
				<div className='absolute inset-0 opacity-10'>
					<div className='grid grid-cols-12 h-full'>
						{Array.from({ length: 12 }).map((_, i) => (
							<div key={i} className='border-r border-white/20'></div>
						))}
					</div>
					<div className='absolute inset-0 grid grid-rows-12 h-full'>
						{Array.from({ length: 12 }).map((_, i) => (
							<div key={i} className='border-b border-white/20'></div>
						))}
					</div>
				</div>

				{/* Main content */}
				<div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center'>
					{/* Animated Title */}
					<div className='mb-8'>
						<h1 className='text-5xl md:text-8xl font-bold mb-4 tracking-wider'>
							{marsToysLetters.map((item, index) => (
								<span
									key={index}
									className={`inline-block ${
										item.color
									} transform transition-all duration-1000 ease-out ${
										isVisible
											? 'translate-y-0 opacity-100 scale-100'
											: 'translate-y-20 opacity-0 scale-75'
									}`}
									style={{
										transitionDelay: `${index * 100}ms`,
										animation: `bounce 2s infinite ${index * 0.1}s`,
									}}
								>
									{item.letter}
								</span>
							))}
						</h1>

						<div
							className={`transform transition-all duration-1000  ${
								isVisible
									? 'translate-y-0 opacity-100'
									: 'translate-y-10 opacity-0'
							}`}
						>
							<p className='text-xl md:text-2xl text-gray-300 font-light mb-2'>
								Yangi mahsulotlar
							</p>
							<div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-500 mx-auto rounded-full'></div>
						</div>
					</div>

					{/* Description */}
					<div
						className={`max-w-2xl transform transition-all duration-1000  ${
							isVisible
								? 'translate-y-0 opacity-100'
								: 'translate-y-20 opacity-0'
						}`}
					>
						<p className='text-gray-300 text-lg leading-relaxed'>
							Eng so‘nggi o‘yinchoqlar – ulgurji narxlarda. Bugun buyurtma
							bering – ertaga do‘koningizda! MarsToys – savdogarlar uchun qulay
							platforma.
						</p>
					</div>

					{/* CTA */}
					<div
						className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 mt-10 ${
							isVisible
								? 'translate-y-0 opacity-100'
								: 'translate-y-20 opacity-0'
						}`}
					>
						<Link to={'/barcha-maxsulotlar'}>
							<SButton />
						</Link>
					</div>

					{/* Floating elements */}
					<div className='absolute top-1/4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-ping'></div>
					<div className='absolute top-3/4 right-12 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-1000'></div>
					<div className='absolute bottom-1/4 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-2000'></div>
				</div>

				{/* Custom animations (global CSS) */}
				<style>{`
				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes bounce {
					0%, 20%, 50%, 80%, 100% {
						transform: translateY(0);
					}
					40% {
						transform: translateY(-10px);
					}
					60% {
						transform: translateY(-5px);
					}
				}
			`}</style>
			</div>
		</div>
	)
}
