import { useCallback, useEffect, useState } from 'react'
// Zarur importlar
import { useGetMeQuery, useUpdateUserMutation } from '@/service/api'
import { Skeleton } from 'antd'
import {
	Edit3,
	Home,
	LogOut,
	MapPin,
	Package,
	Phone,
	Save,
	User,
	X,
} from 'lucide-react'
import { toast } from 'sonner'

// --- ASOSIY KOMPONENT ---

const Profile = () => {
	// RTK Query hooks (loyihangizdan)
	const { data, isLoading } = useGetMeQuery()
	const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

	const [load, setLoad] = useState(false)
	const [isEditing, setIsEditing] = useState(false)

	// 🔥 Form ichidagi ma’lumotlar
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		phone_number: '',
		address: '',
	})

	const userData = data // Qulaylik uchun

	// 🔥 API dan kelgan ma’lumot formga tushadi
	useEffect(() => {
		// data mavjud bo'lsa va isEditing false bo'lsa, ma'lumotlarni yuklash
		if (data) {
			setFormData({
				first_name: data?.first_name || '',
				last_name: data?.last_name || '',
				// Telefon raqam mavjud bo'lmasa, localStorage'dan olish
				phone_number: data?.phone_number || localStorage.getItem('phone') || '',
				address: data?.address || '',
			})
		}
	}, [data])

	// 🔥 Input o‘zgarishi - TUZATISH: useCallback va funksional yangilanish
	const handleChange = useCallback(e => {
		const { name, value } = e.target
		// Oldingi statega asoslanib yangilash
		setFormData(prev => ({ ...prev, [name]: value }))
	}, [])

	// 🔥 Saqlash funksiyasi
	const handleSave = async () => {
		try {
			await updateUser(formData).unwrap()
			toast.success('Ma’lumotlar yangilandi ✅')
			setIsEditing(false)
		} catch (err) {
			toast.error('Xatolik yuz berdi ❌')
			console.error(err)
		}
	}

	// 🔥 Logout
	const handleLogout = () => {
		setLoad(true)
		setTimeout(() => {
			localStorage.clear()
			toast.success('Muvaffaqiyatli chiqildi!')
			window.location.pathname = '/login'
			setLoad(false)
		}, 1500)
	}

	// Bekor qilish funksiyasi
	const handleCancel = () => {
		// O'zgartirilgan ma'lumotlarni asl (data) ma'lumotlarga qaytarish
		if (data) {
			setFormData({
				first_name: data?.first_name || '',
				last_name: data?.last_name || '',
				phone_number: data?.phone_number || localStorage.getItem('phone') || '',
				address: data?.address || '',
			})
		}
		setIsEditing(false)
	}

	// 🔄 Skeleton holati
	if (load || isLoading) {
		return (
			<div className='w-full h-screen flex items-start justify-center bg-white'>
				<div className='w-full h-full max-w-lg px-4 py-6 space-y-4'>
					{/* Header skeleton */}
					<div className='flex flex-col items-center gap-3 pb-4'>
						<Skeleton.Avatar active size={80} />
						<Skeleton.Input active size='small' style={{ width: 180 }} />
					</div>

					{/* Body skeleton fields */}
					<div className='space-y-3'>
						<Skeleton.Input active block size='large' style={{ height: 55 }} />
						<Skeleton.Input active block size='large' style={{ height: 55 }} />
						<Skeleton.Input active block size='large' style={{ height: 55 }} />
						<Skeleton.Input active block size='large' style={{ height: 55 }} />
					</div>

					{/* Action buttons */}
					<div className='pt-4 space-y-3'>
						<Skeleton.Button active block size='large' style={{ height: 45 }} />
						<Skeleton.Button active block size='large' style={{ height: 45 }} />
						<Skeleton.Button active block size='large' style={{ height: 45 }} />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='w-full h-screen flex items-start justify-center overflow-hidden bg-white'>
			<div className='w-full h-full max-w-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hiddentransition-all'>
				{/* Header */}
				<div className='relative bg-blue-600 text-white pt-3 px-6 flex flex-col items-center justify-center rounded-b-4xl shadow-md'>
					<div className='w-18 h-18 rounded-full bg-blue-500/40 border-4 border-white flex items-center justify-center shadow-lg'>
						<User size={40} strokeWidth={1.5} />
					</div>
					<h2 className='text-2xl font-semibold mt-3'>
						{userData?.first_name} {userData?.last_name}
					</h2>
				</div>

				{/* Body */}
				<div className='p-2 space-y-4 mt-4'>
					{isEditing ? (
						<>
							{/* TUZATISH: value={formData.first_name} ni ishlatish */}
							<EditableField
								icon={<User className='text-blue-600 w-4 h-4' />}
								label='Ism'
								name='first_name'
								value={formData.first_name}
								onChange={handleChange}
							/>

							{/* TUZATISH: value={formData.last_name} ni ishlatish */}
							<EditableField
								icon={<User className='text-blue-600 w-4 h-4' />}
								label='Familiya'
								name='last_name'
								value={formData.last_name}
								onChange={handleChange}
							/>

							{/* TUZATISH: value={formData.phone_number} ni ishlatish */}
							<EditableField
								icon={<Phone className='text-blue-600 w-4 h-4' />}
								label='Telefon raqam'
								name='phone_number'
								value={formData.phone_number}
								onChange={handleChange}
							/>

							{/* TUZATISH: value={formData.address} ni ishlatish */}
							<EditableField
								icon={<MapPin className='text-blue-600 w-4 h-4' />}
								label='Manzil'
								name='address'
								value={formData.address}
								onChange={handleChange}
							/>

							<div className='flex gap-3 pt-4 text-white'>
								<button
									onClick={handleSave}
									disabled={isUpdating}
									className='flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow transition-all'
								>
									<Save size={16} className='text-white' />
									{isUpdating ? (
										<div className='animate-spin w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full'></div>
									) : (
										<span className='text-white'>Saqlash</span>
									)}
								</button>
								<button
									onClick={handleCancel} // Bekor qilish funksiyasini chaqirish
									className='flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium border transition-all'
								>
									<X size={16} />
									Bekor qilish
								</button>
							</div>
						</>
					) : (
						<>
							<ProfileInfo
								icon={<Phone className='text-blue-600 w-4 h-4' />}
								label='Telefon raqam'
								value={`+${userData?.phone_number}`}
							/>
							<ProfileInfo
								icon={<MapPin className='text-blue-600 w-4 h-4' />}
								label='Manzil'
								value={userData?.address}
							/>

							<div className='pt-4 flex flex-col gap-3 text-white'>
								<button
									onClick={() => setIsEditing(true)}
									className='flex items-center justify-start gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow transition-all'
								>
									<Edit3 size={16} />
									Tahrirlash
								</button>

								<a
									href='/'
									className='flex items-center gap-3 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2.5 rounded-xl text-sm font-medium border border-blue-200 transition-all'
								>
									<Home size={16} />
									Bosh sahifa
								</a>
								<a
									href='/my-order'
									className='flex items-center gap-3 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium border transition-all'
								>
									<Package size={16} />
									Mening buyurtmalarim
								</a>
								<button
									onClick={handleLogout}
									className='flex items-center gap-1.5 text-white/80 hover:text-white bg-red-500 hover:bg-red-600 duration-300 px-3 py-3 rounded-lg text-xs sm:text-sm transition-all'
								>
									<LogOut size={14} />
									Chiqish
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

// --- YORDAMCHI KOMPONENTLAR ---

const ProfileInfo = ({ icon, label, value }) => (
	<div className='flex items-center gap-3 bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-200 transition-all'>
		<div className='flex-shrink-0'>{icon}</div>
		<div>
			<p className='text-xs text-gray-500 uppercase tracking-wide'>{label}</p>
			<p className='text-gray-800 font-medium text-sm break-words'>
				{value || 'Kiritilmagan'}
			</p>
		</div>
	</div>
)

const EditableField = ({ icon, label, name, value, onChange }) => (
	<div className='flex items-center gap-3 bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-200 transition-all'>
		<div className='flex-shrink-0'>{icon}</div>
		<div className='w-full'>
			<p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>
				{label}
			</p>
			<input
				name={name}
				// Qiymat null/undefined bo'lmasligi uchun bo'sh stringga o'tkazish
				value={value || ''}
				onChange={onChange}
				className='w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all'
			/>
		</div>
	</div>
)

export default Profile
