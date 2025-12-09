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
		{ icon: Instagram, href: 'https://www.instagram.com/marstoys01/' },
		{
			icon: Youtube,
			href: 'https://www.youtube.com/channel/UCeBGmOrSWLpHz3ROCwlh8qA',
		},
		{ icon: Send, href: 'https://t.me/sardorigrushki' },
	]

	return (
		<div className='min-h-screen relative overflow-hidden'>
			{/* Desktop Background */}
			<div
				className='absolute inset-0 bg-cover bg-center hidden md:block'
				style={{
					backgroundImage:
						"url('https://wallpapercat.com/w/full/4/a/8/47281-3840x2160-desktop-4k-toy-story-background-image.jpg')",
				}}
			/>

			{/* Mobile Background */}
			<div
				className='absolute inset-0 bg-cover bg-center md:hidden'
				style={{
					backgroundImage:
						"url('https://i.pinimg.com/736x/be/ae/b9/beaeb95e8410849dc59b6bc6c41c3dd6.jpg')",
				}}
			/>

			{/* Overlay */}
			<div className='absolute inset-0 bg-black/60 md:bg-black/70' />

			{/* Soft gradients */}
			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute top-10 left-5 w-32 h-32 md:w-64 md:h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse' />
				<div className='absolute bottom-10 right-5 w-36 h-36 md:w-72 md:h-72 bg-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000' />
			</div>

			{/* Grid – only desktop */}
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

			{/* MAIN CONTENT */}
			<div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center'>
				{/* HERO TITLE */}
				<h1 className='text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-wider'>
					{marsToysLetters.map((item, index) => (
						<span
							key={index}
							className={`inline-block ${
								item.color
							} transition-all duration-1000 ${
								isVisible
									? 'translate-y-0 opacity-100 scale-100'
									: 'translate-y-20 opacity-0 scale-75'
							}`}
							style={{ transitionDelay: `${index * 100}ms` }}
						>
							{item.letter}
						</span>
					))}
				</h1>

				{/* <p
					className={`text-lg sm:text-xl md:text-2xl text-gray-200 font-semibold mb-3 transition-all duration-1000 ${
						isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
					}`}
					style={{ transitionDelay: '300ms' }}
				>
					Eng so‘nggi o‘yinchoqlar — ulgurji narxlarda!
				</p> */}

				<p
					className={`max-w-xl md:max-w-2xl text-sm sm:text-base md:text-lg text-gray-200 transition-all duration-1000 ${
						isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
					}`}
					style={{ transitionDelay: '450ms' }}
				>
					Bugun buyurtma bering — ertaga do‘koningizda! MarsToys — savdogarlar
					uchun qulay platforma.
				</p>

				{/* Button */}
				<div
					className={`mt-6 transition-all duration-1000 ${
						isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
					}`}
					style={{ transitionDelay: '550ms' }}
				>
					<Link to={`/barcha-maxsulotlar`}>
						<SButton />
					</Link>
				</div>

				{/* Social icons */}
				<div
					className={`flex gap-4 mt-6 transition-all duration-1000 ${
						isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
					}`}
					style={{ transitionDelay: '650ms' }}
				>
					{socialLinks.map((item, i) => {
						const Icon = item.icon
						return (
							<a
								key={i}
								href={item.href}
								className='p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110'
							>
								<Icon className='w-5 h-5 sm:w-6 sm:h-6' />
							</a>
						)
					})}
				</div>
			</div>
		</div>
	)
}
