import { useState } from 'react'
import React from 'react'

const navLinks = [
	{ title: 'Басты бет', url: '/' },
	{ title: 'Articles', url: '/blog' },
]

const Header = () => {
	const [navbar, setNavbar] = useState(false)
	return (
		<header className='w-full bg-black shadow'>
			<div className='container justify-between gap-3 px-4 mx-auto  md:items-center md:flex md:px-8'>
				<div className='flex items-center justify-between py-3 md:py-5 md:block'>
					<a href='/'>
						<img
							src='/logo.svg'
							alt='image'
							width={185}
							className='w-[120px] md:w-full'
						></img>
					</a>
					<div className='md:hidden'>
						<button
							className='p-2 text-gray-700 rounded-md outline-none'
							onClick={() => setNavbar(!navbar)}
						></button>
					</div>
				</div>

				<div
					className={`flex-1 justify-self-center p-3 py-5 md:p-0 md:block md:pb-0 md:mt-0 ${
						navbar ? 'flex' : 'hidden'
					}`}
				>
					<ul className='items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0 text-xl'>
						{navLinks.map((data, index) => (
							<li key={index} className='hover:text-yellow transition-colors'>
								<a href={data.url}>{data.title}</a>
							</li>
						))}
					</ul>
				</div>
				<div className='items-center gap-5 hidden md:flex'>
					<a href='' className='py-2 px-6 border-2 border-purpur rounded-full'>
						Вход
					</a>
					<a href='' className='py-2 px-6 text-black bg-yellow rounded-full'>
						Регистрация
					</a>
				</div>
			</div>
		</header>
	)
}

export default Header
