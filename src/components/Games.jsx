import React, { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { Tab } from '@headlessui/react'
import {
	ChevronDoubleRightIcon,
	MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'

import './Games.css'
const AllGames = [
	{
		image: '/games/fortune.png',
		title: 'Valentine’s Fortune',
		rating: '5',
	},
	{
		image: '/games/fruit.png',
		title: 'Valentine’s Fortune',
		rating: '5',
	},
	{
		image: '/games/monkey.png',
		title: 'Valentine’s Fortune',
		rating: '5',
	},
	{
		image: '/games/valentine.png',
		title: 'Valentine’s Fortune',
		rating: '5',
	},
	{
		image: '/games/monkey.png',
		title: 'Valentine’s Fortune',
		rating: '5',
	},
]
const MostPopularGames = [
	{
		image: '/games/tiger.jpg',
		title: 'Valentine’s Fortune',
		rating: '5',
	},
	{
		image: '/games/book.png',
		title: 'Valentine’s Fortune',
		rating: '5',
	},
	{
		image: '/games/pyramid.png',
		title: 'Valentine’s Fortune',
		rating: '5',
	},
	{
		image: '/games/retro.png',
		title: 'Valentine’s Fortune',
		rating: '5',
	},
	{
		image: '/games/island.png',
		title: 'Valentine’s Fortune',
		rating: '5',
	},
]

const Games = () => {
	return (
		<div className='py-5'>
			<h2 className='mb-3 text-2xl font-semibold'>Games:</h2>
			<div className='bg-purpur px-6 py-7 rounded-md'>
				<Tab.Group>
					<Tab.List className='mb-5 flex items-center'>
						<Tab className=' ui-selected:text-yellow ui-not-selected:text-white me-4 outline-none'>
							All games
						</Tab>
						<Tab className='ui-selected:text-yellow ui-not-selected:text-white outline-none'>
							Most popular
						</Tab>
						<form className='ms-auto relative' action='https:/vk.com'>
							<input
								type='text'
								placeholder='Search'
								className='rounded-full bg-dark py-2 px-5 text-md outline-none'
							/>
							<div className='absolute right-4 top-3'>
								<MagnifyingGlassIcon className='w-5 h-5' />
							</div>
						</form>
					</Tab.List>
					<Tab.Panels>
						<Tab.Panel>
							<ul className='columns-5 mb-3'>
								{AllGames.map((game, index) => (
									<li
										key={index}
										className='bg-dark rounded-lg w-full overflow-hidden'
									>
										<div className='relative group/item'>
											<img
												src={game.image}
												alt={game.title}
												className='h-[180px]  w-full rounded'
											/>
											<button
												className='group/edit invisible absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
											group-hover/item:visible bg-dark p-3 rounded-md w-[170px] text-center transition-colors hover:bg-white hover:text-black'
											>
												Play
											</button>
										</div>

										<div className='py-5 px-3'>
											<div className='mb-3'>{game.title}</div>
											<div className='flex items-end gap-3'>
												<Rating
													readonly={true}
													initialValue={game.rating}
													SVGclassName='w-[23px] h-[23px]'
												/>
												<span className=' text-yellow'>{game.rating}</span>
											</div>
										</div>
									</li>
								))}
							</ul>
							<div className='text-end'>
								<a
									href=''
									className='flex items-center justify-end gap-2 hover:text-yellow transition-colors'
								>
									More <ChevronDoubleRightIcon className='h-5 w-5' />
								</a>
							</div>
						</Tab.Panel>
						<Tab.Panel>
							<ul className='columns-5 mb-3'>
								{MostPopularGames.map((game, index) => (
									<li
										key={index}
										className='bg-dark rounded-lg w-full overflow-hidden'
									>
										<div className='relative group/item'>
											<img
												src={game.image}
												alt={game.title}
												className='h-[180px] w-full rounded'
											/>
											<button
												className='group/edit invisible absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
											group-hover/item:visible bg-dark p-3 rounded-md w-[170px] text-center transition-colors hover:bg-white hover:text-black'
											>
												Play
											</button>
										</div>

										<div className='py-5 px-3'>
											<div className='mb-3'>{game.title}</div>
											<div className='flex items-center gap-3'>
												<Rating
													readonly={true}
													initialValue={game.rating}
													SVGclassName='w-[23px] h-[23px]'
												/>
												<span className='lh-1 text-yellow'>{game.rating}</span>
											</div>
										</div>
									</li>
								))}
							</ul>
							<div className='text-end'>
								<a
									href=''
									className='flex items-center justify-end gap-2 hover:text-yellow transition-colors'
								>
									More <ChevronDoubleRightIcon className='h-5 w-5' />
								</a>
							</div>
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
			</div>
		</div>
	)
}

export default Games
