import { motion } from 'framer-motion'

const ToyCarousel = () => {
	const images = [
		'/public/toys/1.png',
		'/public/toys/2.png',
		'/public/toys/3.png',
		'/public/toys/4.png',
		'/public/toys/5.png',
		'/public/toys/6.webp',
		'/public/toys/7.jpg',
		'/public/toys/8.webp',
	]

	return (
		<div className='overflow-hidden relative w-full'>
			<h2 className='text-3xl font-bold text-center pb-5'>
				🎠 O‘yinchoqlar dunyosi
			</h2>

			<motion.div
				className='flex gap-6'
				animate={{ x: ['0%', '-100%'] }}
				transition={{
					repeat: Infinity,
					repeatType: 'loop',
					duration: 30, // aylanish tezligi (katta bo‘lsa — sekin)
					ease: 'linear',
				}}
			>
				{/* 2 marta map qilamiz — infinite effect uchun */}
				{[...images, ...images].map((src, i) => (
					<div
						key={i}
						className='min-w-[250px] h-[180px] rounded-2xl overflow-hidden shadow-md border border-blue-100 hover:scale-105 transition-transform duration-300 bg-white'
					>
						<img
							src={src}
							alt={`toy-${i}`}
							className='w-full h-full object-cover'
						/>
					</div>
				))}
			</motion.div>
		</div>
	)
}

export default ToyCarousel
