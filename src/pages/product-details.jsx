import NewProducts from '@/components/newProducts'
import ProductDetail from '@/components/product-detail'
import { useParams } from 'react-router-dom'

export default function ProductDetails() {
	const { id } = useParams()

	return (
		<div className='min-h-screen bg-background'>
			<ProductDetail id={id} />
			<NewProducts />
		</div>
	)
}
