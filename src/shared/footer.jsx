import { Instagram, MapPin, Phone, Send, Youtube } from 'lucide-react'

const Footer = () => {
	const socialLinks = [
		{
			icon: Instagram,
			href: 'https://www.instagram.com/marstoys01/',
			label: 'Instagram',
			color: 'hover:text-pink-500',
		},
		{
			icon: Youtube,
			href: 'https://www.youtube.com/channel/UCeBGmOrSWLpHz3ROCwlh8qA',
			label: 'YouTube',
			color: 'hover:text-red-500',
		},
		{
			icon: Send,
			href: 'https://t.me/sardorigrushki',
			label: 'Telegram',
			color: 'hover:text-sky-500',
		},
	]

	return (
		<footer className='bg-gradient-to-b pb-20 from-blue-500 via-blue-600 to-blue-600 text-white py-10 px-6 md:px-10 border-t border-white/10 rounded-t-3xl'>
			<div className='max-w-6xl mx-auto flex flex-col items-center text-center gap-8'>
				{/* Contact Info */}
				<div className='space-y-3'>
					<div className='flex items-center justify-center gap-2 text-sm md:text-base opacity-90'>
						<MapPin size={18} />
						<span>O‘rikzor bozori, Gilam bozor / Samarbonu 39A/1</span>
					</div>
					<a
						href='tel:+998931374426'
						className='flex items-center justify-center gap-2 text-sm md:text-base hover:text-green-400 transition-colors duration-200'
					>
						<Phone size={18} />
						<span>+998 93 137 44 26</span>
					</a>
				</div>

				{/* Social Links */}
				<div className='flex items-center justify-center gap-5 md:gap-6'>
					{socialLinks.map((social, index) => {
						const Icon = social.icon
						return (
							<a
								key={index}
								href={social.href}
								aria-label={social.label}
								target='_blank'
								rel='noopener noreferrer'
								className={`group relative p-3 md:p-3.5 rounded-full bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-110 ${social.color}`}
							>
								<Icon className='w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:rotate-6' />
							</a>
						)
					})}
				</div>

				{/* Divider */}
				<div className='w-20 h-[1px] bg-white/20 rounded-full' />

				{/* Copyright */}
				<p className='text-xs md:text-sm text-white/70 font-light tracking-wide'>
					© {new Date().getFullYear()}{' '}
					<span className='text-white font-medium'>Mars Toys</span> — Barcha
					huquqlar himoyalangan.
				</p>
			</div>
		</footer>
	)
}

export default Footer
