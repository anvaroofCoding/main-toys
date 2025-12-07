import { Skeleton } from 'antd'

const ProductSkeleton = () => {
	return (
		<div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
			{/* Image Skeleton */}
			<Skeleton.Input active block style={{ height: 180 }} />

			<div className='p-3'>
				<Skeleton active title={false} paragraph={{ rows: 2 }} />
				<div className='mt-3 flex items-center justify-between'>
					<Skeleton.Input active style={{ width: 80 }} />
					<Skeleton.Button active shape='circle' size='middle' />
				</div>
			</div>
		</div>
	)
}

export default ProductSkeleton
