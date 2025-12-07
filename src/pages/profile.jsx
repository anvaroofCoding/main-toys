import { useGetMeQuery, useUpdateUserMutation } from '@/service/api'
import { Skeleton } from 'antd'
import {
	Check,
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
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

const Profile = () => {
	const [activeId, setActiveId] = useState(null)
	const { data, isLoading } = useGetMeQuery()
	const [updateUser, { isLoading: isUpdating, isError, error }] =
		useUpdateUserMutation()
	const [load, setLoad] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		phone_number: '',
		address: '',
	})

	const userData = data

	useEffect(() => {
		if (data) {
			setFormData({
				first_name: data?.first_name || '',
				last_name: data?.last_name || '',
				phone_number: data?.phone_number || localStorage.getItem('phone') || '',
				address: data?.address || '',
			})
		}
	}, [data])

	const handleChange = useCallback(e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}, [])

	const handleSave = async () => {
		try {
			await updateUser(formData).unwrap()
			toast.success('Ma’lumotlar yangilandi')
			setIsEditing(false)
		} catch (err) {
			toast.error('Xatolik yuz berdi')
			console.error(err)
		}
	}

	const handleLogout = () => {
		setLoad(true)
		setTimeout(() => {
			localStorage.clear()
			toast.success('Muvaffaqiyatli chiqildi!')
			window.location.pathname = '/login'
			setLoad(false)
		}, 1500)
	}

	const handleCancel = () => {
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

	if (load || isLoading)
		return (
			<div className='w-full h-screen flex items-start justify-center bg-white'>
				<div className='w-full h-full max-w-lg px-4 py-6 space-y-4'>
					<div className='flex flex-col items-center gap-3 pb-4'>
						<Skeleton.Avatar active size={80} />
						<Skeleton.Input active size='small' style={{ width: 180 }} />
					</div>
					<div className='space-y-3'>
						<Skeleton.Input active block size='large' style={{ height: 55 }} />
						<Skeleton.Input active block size='large' style={{ height: 55 }} />
						<Skeleton.Input active block size='large' style={{ height: 55 }} />
						<Skeleton.Input active block size='large' style={{ height: 55 }} />
					</div>
					<div className='pt-4 space-y-3'>
						<Skeleton.Button active block size='large' style={{ height: 45 }} />
						<Skeleton.Button active block size='large' style={{ height: 45 }} />
						<Skeleton.Button active block size='large' style={{ height: 45 }} />
					</div>
				</div>
			</div>
		)

	return (
		<div className='w-full min-h-screen flex items-start justify-center pb-8'>
			<div className='w-full max-w-lg'>
				{/* HEADER */}
				<div className='relative bg-gradient-to-b from-blue-700 to-blue-600 text-white pt-10 pb-8 px-6 flex flex-col items-center justify-center rounded-b-3xl shadow-xl backdrop-blur-xl'>
					<div className='w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl border border-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex items-center justify-center'>
						<User size={42} strokeWidth={1.5} />
					</div>

					<h2 className='text-2xl font-semibold mt-4 tracking-wide'>
						{userData?.first_name} {userData?.last_name}
					</h2>

					<div className='flex items-center gap-1 mt-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/30 shadow-md'>
						<span className='text-xs font-light'>Tastiqlangan hisob</span>
						<div className='w-4 h-4 bg-green-400 rounded-full flex items-center justify-center shadow'>
							<Check className='w-3 h-3 text-white' />
						</div>
					</div>
				</div>

				{/* BODY */}
				<div className='p-4 mt-3 space-y-4 bg-white/60 backdrop-blur-xl shadow-lg rounded-3xl border border-gray-200'>
					{isEditing ? (
						<>
							<EditableField
								icon={<User className='text-blue-600 w-4 h-4' />}
								label='Ism'
								name='first_name'
								value={formData.first_name}
								onChange={handleChange}
							/>
							<EditableField
								icon={<User className='text-blue-600 w-4 h-4' />}
								label='Familiya'
								name='last_name'
								value={formData.last_name}
								onChange={handleChange}
							/>
							<EditableField
								icon={<Phone className='text-blue-600 w-4 h-4' />}
								label='Telefon raqam'
								name='phone_number'
								value={formData.phone_number}
								onChange={handleChange}
							/>
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
									className='flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[.97] transition-all shadow-lg text-white px-4 py-3 rounded-2xl text-sm font-medium'
								>
									<Save size={16} />
									{isUpdating ? (
										<div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
									) : (
										'Saqlash'
									)}
								</button>
								<button
									onClick={handleCancel}
									className='flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-[.97] transition-all px-4 py-3 rounded-2xl text-sm font-medium text-white shadow-lg'
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
									className='flex items-center justify-start gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl text-sm font-medium shadow-lg transition-all active:scale-[.97]'
								>
									<Edit3 size={16} />
									Tahrirlash
								</button>

								<a
									href='/'
									className='flex items-center gap-3 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-3 rounded-2xl text-sm font-medium border border-blue-200 shadow transition-all active:scale-[.97]'
								>
									<Home size={16} />
									Bosh sahifa
								</a>
								<a
									href='/my-order'
									className='flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-3 rounded-2xl text-sm font-medium shadow transition-all active:scale-[.97]'
								>
									<Package size={16} />
									Mening buyurtmalarim
								</a>
								<button
									onClick={handleLogout}
									className='flex items-center gap-1.5 text-white/80 hover:text-white bg-red-500 hover:bg-red-600 duration-300 px-3 py-3 rounded-lg text-xs sm:text-sm transition-all shadow'
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
	<div className='flex items-center gap-4 bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-all'>
		<div className='p-3 rounded-xl bg-blue-50 shadow-inner'>{icon}</div>
		<div>
			<p className='text-[11px] text-gray-500 uppercase tracking-wide'>
				{label}
			</p>
			<p className='text-gray-900 font-semibold text-sm break-words'>
				{value || 'Kiritilmagan'}
			</p>
		</div>
	</div>
)

const EditableField = ({ icon, label, name, value, onChange }) => (
	<div className='flex items-center gap-4 bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 shadow-md transition-all'>
		<div className='p-3 rounded-xl bg-blue-50 shadow-inner'>{icon}</div>
		<div className='w-full'>
			<p className='text-[11px] text-gray-500 uppercase tracking-wide mb-1'>
				{label}
			</p>
			<input
				name={name}
				value={value || ''}
				onChange={onChange}
				className='w-full bg-white/80 border border-gray-300 rounded-xl px-3 py-2 text-sm shadow-inner focus:ring-2 focus:ring-blue-400 outline-none transition-all backdrop-blur-sm'
			/>
		</div>
	</div>
)

export default Profile
