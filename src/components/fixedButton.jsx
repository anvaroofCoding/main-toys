import { motion } from 'framer-motion'
import { PhoneCall } from 'lucide-react'

const FloatingCallButton = () => {
	return (
		<a href='tel:+998931374426' className='fixed bottom-25 right-6 z-50'>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ type: 'spring', stiffness: 120, damping: 10 }}
				whileHover={{ scale: 1.1 }}
				className='relative flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300'
			>
				{/* Ichki puls animatsiyasi */}
				<span className='absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping'></span>
				<PhoneCall className='w-6 h-6 relative z-10' />
			</motion.div>
		</a>
	)
}

export default FloatingCallButton
