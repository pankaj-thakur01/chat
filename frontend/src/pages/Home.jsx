import React, { useContext, useState } from 'react'
import Chatcontainer from '../component/Chatcontainer'
import Sidebar from '../component/Sidebar'
import Rightsidebar from '../component/Rightsidebar'
import { ChatContext } from '../../context/Chatcontext'

function Home() {

const {selecteduser} = useContext(ChatContext)





  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
<div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selecteduser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2' }`}>

<Sidebar />
<Chatcontainer />
<Rightsidebar />



</div>

    </div>
  )
}

export default Home