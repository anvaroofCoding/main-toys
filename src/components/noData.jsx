import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'

const NoData = () => {
	return (
		<div className='flex flex-col justify-center items-center h-full pt-10 bg-gray-50 text-gray-600'>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
				transition={{
					type: 'tween', // ✅ spring o‘rniga tween ishlatyapmiz
					ease: 'easeInOut',
					duration: 0.8,
				}}
				className='flex items-center justify-center mb-4'
			>
				<SearchX size={60} className='text-gray-400' />
			</motion.div>

			<motion.h2
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.5 }}
				className='text-xl font-medium'
			>
				Ma'lumot topilmadi
			</motion.h2>
		</div>
	)
}

export default NoData
