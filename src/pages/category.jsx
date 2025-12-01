import { useCategoriyesQuery } from '@/service/api'
import { Loader2, Package, Shapes } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Category = () => {
	const { data, isLoading } = useCategoriyesQuery()
	const navigate = useNavigate()

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-background'>
				<div className='flex flex-col items-center gap-3'>
					<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
					<p className='text-sm text-muted-foreground'>Yuklanmoqda...</p>
				</div>
			</div>
		)
	}

	const handCategry = catId => {
		localStorage.setItem('selectedCategory', catId)
		navigate('/barcha-maxsulotlar')
	}

	if (!data?.length) {
		return (
			<div className='flex justify-center items-center h-[50vh] text-gray-500'>
				Hech qanday kategoriya topilmadi 😔
			</div>
		)
	}

	return (
		<div className='py-10 pb-20 xl:container mx-auto px-2'>
			<h2 className='text-2xl md:text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-blue-600'>
				<Shapes className='w-7 h-7 text-blue-500' />
				Kategoriyalar
			</h2>

			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
				{data.map(items => (
					<div
						key={items.id}
						onClick={() => handCategry(items.id)}
						className='group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition duration-200 p-4 flex flex-col items-center justify-center text-center hover:bg-blue-50 cursor-pointer'
					>
						<div className='bg-blue-100 text-blue-600 p-3 rounded-full mb-3 group-hover:bg-blue-500 group-hover:text-white transition'>
							<Package className='w-6 h-6' />
						</div>

						<h3 className='text-sm md:text-base font-semibold text-gray-800 group-hover:text-blue-600 transition line-clamp-2'>
							{items.name}
						</h3>

						<p className='text-xs text-gray-500 mt-1'>
							{items.product_count} ta mahsulot
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Category
