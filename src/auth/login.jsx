import Profile from '@/pages/profile'
import { RedoOutlined, RollbackOutlined, SendOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'

const Login = () => {
	const [rawPhone, setRawPhone] = useState('')
	const [isVisible, setIsVisible] = useState(false)
	const [load, setLoad] = useState(false)
	const [loc, setLoc] = useState(false)
	const length = 5
	const [values, setValues] = useState(Array(length).fill(''))
	const inputsRef = useRef([])
	const [time, setTime] = useState(30)
	const [startTimer, setStartTimer] = useState(false)
	const navigate = useNavigate()
	const token = localStorage.getItem('access_token')

	useEffect(() => {
		setIsVisible(true)
	}, [])

	useEffect(() => {
		if (!startTimer) return
		if (time <= 0) {
			setStartTimer(false)
			return
		}

		const timerId = setInterval(() => {
			setTime(prev => prev - 1)
		}, 1000)

		return () => clearInterval(timerId)
	}, [startTimer, time])

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
	}

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

	const formatPhone = value => {
		let formatted = ''
		if (value.length > 0) formatted = '(' + value.substring(0, 2)
		if (value.length >= 2) formatted += ')-' + value.substring(2, 5)
		if (value.length >= 5) formatted += '-' + value.substring(5, 7)
		if (value.length >= 7) formatted += '-' + value.substring(7, 9)
		return formatted
	}

	const handleChange = e => {
		let value = e.target.value.replace(/\D/g, '')
		if (value.length > 9) value = value.slice(0, 9)
		setRawPhone(value)
	}

	const handleKeyDown = e => {
		if (e.key === 'Backspace') {
			const formatted = formatPhone(rawPhone)
			const cursorPos = e.target.selectionStart
			if (/[()\-]/.test(formatted[cursorPos - 1])) {
				e.preventDefault()
				setRawPhone(prev => prev.slice(0, -1))
			}
		}
	}

	const SentNumber = async () => {
		setLoad(true)
		try {
			const res = await fetch('https://api.toysmars.uz/users/register/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ phone_number: `998${rawPhone}` }),
			})

			if (res.status === 200) {
				setLoc(true)
				setTime(60)
				setStartTimer(true)
			} else {
				toast.warning('Telefon raqam noto‘g‘ri yoki mavjud emas!')
			}

			setLoad(false)
		} catch (err) {
			console.error('❌ Xato:', err)
			toast.warning('Tarmoqqa ulanishda xato!')
			setLoad(false)
		}
	}

	const handleChanges = (e, index) => {
		const val = e.target.value.replace(/\D/g, '')
		const newValues = [...values]
		newValues[index] = val.slice(-1)
		setValues(newValues)

		if (val && index < length - 1) {
			inputsRef.current[index + 1].focus()
		}

		// Faqat oxirgi input to'ldirilganda yuborish
		if (index === length - 1 && newValues.every(v => v !== '')) {
			Handlecode(newValues)
		}
	}

	const handleKeyDowns = (e, index) => {
		if (e.key === 'Backspace') {
			if (values[index]) {
				const newValues = [...values]
				newValues[index] = ''
				setValues(newValues)
			} else if (index > 0) inputsRef.current[index - 1].focus()
		}
	}

	const Handlecode = async currentValues => {
		const code = currentValues ? currentValues.join('') : values.join('')
		const loginDatas = { phone_number: `998${rawPhone}`, otp: code }

		try {
			const res = await fetch('https://api.toysmars.uz/users/login/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(loginDatas),
			})

			if (!res.ok) throw new Error(`Login failed: ${res.status}`)

			const dataRes = await res.json()
			localStorage.setItem('access_token', dataRes.access_token)
			localStorage.setItem('refresh_token', dataRes.refresh_token)
			localStorage.setItem('phone', loginDatas.phone_number)
			toast.success('Muvaffaqiyatli kirildi!')
			navigate(`/shaxsiy-kabinet`)
		} catch (error) {
			console.error('Login error:', error)
			toast.warning('Kiritilgan kod xato!')
		}
	}

	const tokens = localStorage.getItem('access_token')
	if (tokens) return <Profile />

	return (
		<div className='w-full h-screen flex justify-center items-center flex-col gap-2'>
			<Toaster richColors position='top-center' closeButton />
			<div className='absolute top-5 left-5'>
				<Button
					variant='solid'
					color='orange'
					onClick={() => navigate(`/`)}
				>
					Qaytish <RollbackOutlined />
				</Button>
			</div>
			<div
				className={`flex-col items-center gap-2 ${tokens ? 'hidden' : 'flex'}`}
			>
				<div className='flex flex-col items-center justify-center px-6 text-center'>
					<h1 className='text-5xl md:text-8xl font-bold mb-2 tracking-wider'>
						{marsToysLetters.map((item, index) => (
							<span
								key={index}
								className={`inline-block ${
									item.color
								} transition-all duration-1000 ${
									isVisible
										? 'translate-y-0 opacity-100 scale-100'
										: 'translate-y-20 opacity-0 scale-75'
								}`}
								style={{
									transitionDelay: `${index * 100}ms`,
									animation: `bounce 2s infinite ${index * 0.1}s`,
								}}
							>
								{item.letter}
							</span>
						))}
					</h1>
				</div>

				<div className={`${loc ? 'hidden' : 'flex flex-col gap-4'}`}>
					<div className='flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden w-full max-w-[300px] bg-white shadow-sm focus-within:border-blue-500 transition-all duration-200'>
						<span className='px-3 py-2 text-gray-600 text-md font-medium border-r bg-gray-50'>
							+998
						</span>
						<input
							type='tel'
							inputMode='numeric'
							pattern='[0-9]*'
							placeholder='(90)-123-45-67'
							value={formatPhone(rawPhone)}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							className='flex-1 px-3 py-2 bg-transparent outline-none text-gray-800 placeholder:text-gray-400'
						/>
					</div>
					<Button
						size='large'
						type='primary'
						className='mt-4 w-[300px] rounded-2xl shadow-md font-medium hover:scale-[1.02] transition-all duration-200'
						onClick={SentNumber}
						loading={load}
					>
						Jo‘natish <SendOutlined />
					</Button>
				</div>

				<div className={`${loc ? 'flex' : 'hidden'} flex-col items-center`}>
					<div className='flex justify-center gap-3 mb-5'>
						{values.map((val, i) => (
							<input
								key={i}
								type='tel'
								inputMode='numeric'
								pattern='[0-9]*'
								maxLength='1'
								value={val}
								onChange={e => handleChanges(e, i)}
								onKeyDown={e => handleKeyDowns(e, i)}
								ref={el => (inputsRef.current[i] = el)}
								className='w-12 h-12 text-center border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200'
							/>
						))}
					</div>

					<p className='text-gray-500 '>
						{time > 0 ? (
							<span>Kodni tasdiqlash vaqti: {formatTime(time)}</span>
						) : (
							<Button
								size='large'
								type='primary'
								className='mt-4 w-[300px] rounded-2xl shadow-md font-medium hover:scale-[1.02] transition-all duration-200'
								onClick={SentNumber}
								loading={load}
							>
								Qayta kod yuborish <RedoOutlined />
							</Button>
						)}
					</p>
				</div>
			</div>

			<style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
		</div>
	)
}

export default Login
