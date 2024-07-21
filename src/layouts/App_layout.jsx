import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const App_layout = () => {
  return (
    <div>
        <main className=' min-h-screen container '>

            {/* header */}
            <Header></Header>
            {/* body */}
            <Outlet></Outlet>

        </main>

        {/* footer */}
        <div className=' p-10 text-center bg-gray-800 mt-10'>Thanks For Visiting Us ❤️</div>
    </div>
  )
}

export default App_layout