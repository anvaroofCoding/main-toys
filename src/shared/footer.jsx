import { Button } from '@/components/ui/button'
import { Instagram, Send, Youtube } from 'lucide-react'
import { useEffect, useState } from 'react'

const MarsToysLogo = () => {
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
		<h2 className='text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider'>
			{marsToysLetters.map((item, index) => (
				<span
					key={index}
					className={`inline-block ${item.color} transition-all duration-1000 ${
						isVisible
							? 'translate-y-0 opacity-100 scale-100'
							: 'translate-y-20 opacity-0 scale-75'
					}`}
					style={{ transitionDelay: `${index * 100}ms` }}
				>
					{item.letter}
				</span>
			))}
		</h2>
	)
}

const Footer = () => {
	const socialLinks = [
		{
			icon: Instagram,
			href: 'https://www.instagram.com/marstoys01/',
			label: 'Instagram',
		},
		{
			icon: Youtube,
			href: 'https://www.youtube.com/channel/UCeBGmOrSWLpHz3ROCwlh8qA',
			label: 'YouTube',
		},
		{
			icon: Send,
			href: 'https://t.me/sardorigrushki',
			label: 'Telegram',
		},
	]

	return (
		<footer className='bg-slate-900 pb-15 text-white border-t border-slate-800'>
			{/* Main Footer Content */}
			<div className='max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-20'>
				{/* Logo and Description */}
				<div className='mb-12 md:mb-16'>
					<MarsToysLogo />
					<p className='text-slate-400 text-sm mt-6 leading-relaxed max-w-sm'>
						Xafsiz va teskor o'yinchoqlar dunyosiga xush kelibsiz! Mars Toys
						sizning ishonchli hamkoringiz bo'lib, sifatli o'yinchoqlarni taqdim
						etadi.
					</p>
				</div>

				<div className='h-px bg-slate-800 mb-8 md:mb-12' />

				{/* Social Links and Contact */}
				<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-8'>
					<div>
						<p className='text-slate-400 text-sm mb-4'>
							Bizning ijtimoiy tarmoqlarimiz
						</p>
						<div className='flex items-center gap-4'>
							{socialLinks.map(social => {
								const Icon = social.icon
								return (
									<Button
										key={social.label}
										variant='ghost'
										size='icon'
										className='text-slate-400 hover:text-white hover:bg-slate-800 transition-colors'
										asChild
									>
										<a
											href={social.href}
											aria-label={social.label}
											target='_blank'
											rel='noopener noreferrer'
										>
											<Icon className='w-5 h-5' />
										</a>
									</Button>
								)
							})}
						</div>
					</div>

					<div className='text-left md:text-right'>
						<p className='text-slate-400 text-sm mb-2'>Bog'lanish</p>
						<a
							href='tel:+998914872112'
							className='text-white hover:text-blue-400 transition-colors font-medium'
						>
							+998 91 487 21 12
						</a>
						<p className='text-xs text-slate-500 pt-4'>
							© {new Date().getFullYear()} Mars Toys. Barcha huquqlar
							himoyalangan.
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
