import React, { useState, useEffect } from 'react';
import { BsSearch, BsCardList, BsTable } from 'react-icons/bs';
import { GrPowerReset } from 'react-icons/gr';

const apiHandler = (personaCount) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function useFetch() {
			try {
				const res = await fetch(`https://randomuser.me/api/?results=${ personaCount }`);

				if (res.ok) {
					const d = await res.json();
					if (personaCount === 10) {
						const items = d.results;
						setData(items);
					} else {
						const [item] = d.results;
						setData([item, ...data]);
					}
				}
			} catch(err) {
				console.log(err);
			} finally {
				setLoading(false);
			} 
		}

		useFetch();

	}, [personaCount]);

	return { data, setData, loading };
}

const Personas = () => {
	const [view, setView] = useState('list');
	const [searchText, setSearchText] = useState('');
	const [personaCount, setPersonaCount] = useState(10);

	const { data, setData, loading } = apiHandler(personaCount);

	const filteredData = data.filter(el => {
		if (searchText) {
			const fullname = (`${ el.name.first } ${ el.name.last }`).toLowerCase();
			return fullname.includes(searchText);
		}
		return el
	});	

	const search = (e) => {
		const searchText = e.target.value.toLowerCase();
		setSearchText(searchText);
	}

	const resetSearch = () => {
		setSearchText('');
	}

	const changeView = (newView) => {
		setView(newView);
	}

	const addPersona = () => {
		setPersonaCount(personaCount + 1);
		setSearchText('');
	}

	const removePersona = (id) => {
		const newData = data.filter(persona => persona.login.uuid !== id);
		setData(newData);
	}

	return (
		<div className='flex flex-wrap items-center justify-around min-w-full mt-6 sm:w-full'>
			<div className='p-6 mt-6 text-left border w-full rounded-xl'>
				{/* filters */}
				<div className="flex h-30 w-full realtive z-30  py-4 px-6">
					<div className="flex-1 md:flex-none items-center"></div>

					<div id="search" className="flex-auto self-center">
						<div className="w-9/12 relative bg-gray-200 opacity-100 p-3 text-black mx-auto rounded-lg">
							<BsSearch className="absolute left-1 top-4 ml-2" />
							<input type="text" placeholder="Search" className="ml-6 bg-transparent text-black focus:outline-none w-full" value={ searchText } onChange={ search } />
						</div>
					</div>

					<div className='flex flex-start'>
						<GrPowerReset 
							className="cursor-pointer self-center text-lg text-3xl ml-8" 
							onClick={ resetSearch }
						/>
					</div>

					<div id="switcher" className="flex self-center px-3 mr-6">
						<BsCardList 
							className={`cursor-pointer self-center hover:scale-125 mr-2 ${ view === 'list' ? 'text-4xl' : 'text-2xl' }`} 
							onClick={ () => changeView('list') }
						/>
						<BsTable 
							className={`cursor-pointer self-center text-lg hover:scale-125 ${ view === 'grid' ? 'text-3xl' : 'text-2xl' }`} 
							onClick={ () => changeView('grid') }
						/>
					</div>
				</div>
		
				{/* personas views */}
				{ ( !loading && filteredData.length > 0 ) ? (
					(view === 'list') ? (
						<div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 h-auto py-8">
							{ filteredData.map((persona, idx) => (
								<div 
									className="cursor-pointer bg-white hover:bg-indigo-200 md:max-w-sm border-2 p-4 flex" 
									key={ idx }
									onClick={ () => removePersona(persona.login?.uuid) }
								>
									<img 
										className="rounded-full" 
										src={ persona.picture?.thumbnail } alt={ persona.name?.last } 
									/>
									<div className="self-center ml-2">
										<h2>{ `${ persona.name?.first } ${ persona.name?.last }` }</h2>
									</div>
								</div>	
							)) }			
						</div>
					) : (
						<>
							<div className="w-full text-right py-2 font-bold">({ filteredData.length })</div>
							<table className="w-full table-fixed border-seperate border border-spacing-2 border-slate-500">
								<thead className='text-center'>
									<tr className='bg-indigo-500'>
										<th className="border border-slate-600 p-4">Persona Name</th>
										<th className="border border-slate-600">ID</th>
										<th className="border border-slate-600">Address</th>
									</tr>
								</thead>

								<tbody>
									{ filteredData.map((persona, idx) => (
										<tr 
											className="cursor-pointer hover:bg-indigo-200"
											key={ idx }
											onClick={ () => removePersona(persona.login?.uuid) }
										>
											<td className="border border-slate-700 p-4">
												{ `${ persona.name?.first } ${ persona.name.last }` }
											</td>
											<td className="border border-slate-700 p-4">
												{ persona.login?.uuid }
											</td>
											<td className="border border-slate-700 p-4">
												<ul className="list-none">
													<li className='py-2'>
														<b>Coordinates:</b> ({ persona.location.coordinates.latitude }, { persona.location.coordinates.longitude })
													</li>
													<li>
														<b>Address:</b> { `${ persona.location.street.number } ${ persona.location.street.name } ${ persona.location.city }, ${ persona.location.state } ${ persona.location.postcode }` }
													</li>
												</ul>
											</td>
										</tr>
									)) }
								</tbody>
							</table>
						</>
					)
				) : (
					<div className="flex-1 w-full text-center py-8 text-xl font-bold">
						<span className="text-6xl py-3">&#128128;</span><br />
						No persons...
					</div>
				)}

				<div id="addition" className="mt-8 w-full flex justify-end">
					<button 
						className="py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
						onClick={ addPersona }
					>&#43; ADD PERSONA
					</button>
				</div>
			</div>
		</div>
	);
};

export default Personas;
