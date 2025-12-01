import { Instagram, Send, Youtube } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SButton from './Cbutton'

export default function Header() {
	const [isVisible, setIsVisible] = useState(false)
	const token = localStorage.getItem('access_token')

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

	const socialLinks = [
		{
			icon: Instagram,
			href: 'https://www.instagram.com/marstoys01/',
			label: 'Instagram',
		},
		{
			icon: Youtube,
			href: 'https://www.youtube.com/channel/UCeBGmOrSWLpHz3ROCwlh8qA',
			label: 'Youtube',
		},
		{ icon: Send, href: 'https://t.me/sardorigrushki', label: 'Telegram' },
	]

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div
				className='absolute inset-0 bg-cover bg-center hidden md:block'
				style={{
					backgroundImage: `url('https://wallpapercat.com/w/full/4/a/8/47281-3840x2160-desktop-4k-toy-story-background-image.jpg')`,
				}}
			/>
			<div
				className='absolute inset-0 bg-cover bg-center md:hidden'
				style={{
					backgroundImage: `url('https://i.pinimg.com/736x/be/ae/b9/beaeb95e8410849dc59b6bc6c41c3dd6.jpg')`,
				}}
			/>

			{/* Dark overlay for better text readability */}
			<div className='absolute inset-0 bg-black/60 md:bg-black/70' />

			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute top-10 md:top-20 left-5 md:left-10 w-40 md:w-64 h-40 md:h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse' />
				<div className='absolute bottom-10 md:bottom-20 right-5 md:right-10 w-48 md:w-80 h-48 md:h-80 bg-gradient-to-r from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse animation-delay-1000' />
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse animation-delay-2000' />
			</div>

			{/* Grid lines */}
			<div className='absolute inset-0 opacity-5 pointer-events-none hidden md:block'>
				<div className='grid grid-cols-12 h-full'>
					{Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className='border-r border-white/20' />
					))}
				</div>
				<div className='absolute inset-0 grid grid-rows-12 h-full'>
					{Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className='border-b border-white/20' />
					))}
				</div>
			</div>

			{/* Main content */}
			<div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6 text-center'>
				<div className='mb-6 md:mb-5'>
					<h1 className='text-5xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-wider text-balance'>
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
						className={`transform transition-all duration-1000 ${
							isVisible
								? 'translate-y-0 opacity-100'
								: 'translate-y-10 opacity-0'
						}`}
					>
						<p className='text-xl md:text-xl lg:text-3xl text-gray-200 font-bold '>
							Eng so'nggi o'yinchoqlar
						</p>
						<div className='w-50 md:w-44 h-1 bg-gradient-to-r from-blue-500 to-blue-300 mx-auto rounded-full' />
					</div>
				</div>

				<div
					className={`max-w-2xl transform transition-all duration-1000 ${
						isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
					}`}
					style={{ transitionDelay: '400ms' }}
				>
					<p className='text-sm md:text-base lg:text-md text-gray-200 leading-relaxed md:leading-relaxed text-balance mono'>
						Eng so'nggi o'yinchoqlar – ulgurji narxlarda. Bugun buyurtma bering
						– ertaga do'koningizda! MarsToys – savdogarlar uchun qulay
						platforma.
					</p>
				</div>

				<div
					className={`flex flex-col sm:flex-row gap-3 md:gap-4 transform transition-all duration-1000 ${
						isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
					}`}
					style={{ transitionDelay: '500ms' }}
				>
					<Link to={`/barcha-maxsulotlar?need_thing=${token}`}>
						<SButton />
					</Link>
				</div>

				<div
					className={`flex gap-4 md:gap-6 mt-5 transform transition-all duration-1000 ${
						isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
					}`}
					style={{ transitionDelay: '600ms' }}
				>
					{socialLinks.map((social, index) => {
						const Icon = social.icon
						return (
							<a
								key={index}
								href={social.href}
								aria-label={social.label}
								className='p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-white/20 animate-fade-in'
								style={{
									animationDelay: `${700 + index * 100}ms`,
								}}
							>
								<Icon className='w-5 md:w-6 h-5 md:h-6' />
							</a>
						)
					})}
				</div>

				<div className='absolute top-1/4 left-4 md:left-8 w-2 h-2 bg-blue-400 rounded-full animate-ping' />
				<div className='absolute top-3/4 right-4 md:right-12 w-3 h-3 bg-purple-400 rounded-full animate-ping animation-delay-1000' />
				<div className='absolute bottom-1/4 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping animation-delay-2000' />
			</div>

			<style>{`
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
		</div>
	)
}
