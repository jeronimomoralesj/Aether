import { Rocket } from 'lucide-react'
import React from 'react'

function page() {
  return (
    <div className='bottom-0 right-0 flex justify-end sticky'>
      <Rocket className='bg-[#ffff] text-blue-500 rounded-xl h-12 w-12 p-3 hover:bg-[#feed] cursor-pointer transition'/>
    </div>
  )
}

export default page