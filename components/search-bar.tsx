import React, { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { Product } from '@/types'

interface SearchProps {
    data: Product[]
}

export const SearchBar: React.FC<SearchProps> = ({ data }) => {
    const [input, setInput] = useState("");


    return (
        <div className='bg-slate-100 flex align-middle items-center w-1/4 ml-auto h-10 rounded-xl '>
            <SearchIcon className='mx-2' />
            <input
                // value={input.data.name}
                className='w-full mr-2 py-1 border-0 text-base outline-none rounded-xl bg-slate-100'
                type="text"
                placeholder=' Search for Product...'
            />
        </div>
    )
}
