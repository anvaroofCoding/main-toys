import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const NoData = () => (
	<div className='flex flex-col items-center justify-center'>
		<DotLottieReact
			src='https://lottie.host/369278ec-7da1-4be8-b1e2-673969c7d917/rNPC6WDZaH.lottie'
			loop
			autoplay
		/>
		<p className='text-gray-600 mt-3 text-sm font-medium'>Ma'lumot topilmadi</p>
	</div>
)

export default NoData
