import React from 'react'
import { useState } from 'react';
import "./Navbar.css"

const Navbar = () => {

    const [isMoved, setIsMoved] = useState(true);

    function handleMobNav() {
        setIsMoved(!isMoved);
    }

    return (
        <>
            <div className="nav-container bg-blue-700 text-white sm:flex sm:flex-row sm:justify-around flex flex-row-reverse justify-between items-center sm:px-0 px-14 h-14">
                <div className='Logo font-semibold text-lg'>
                    Find your Bus
                </div>
                <div className='nav-opt h-14 flex justify-center items-center'>
                    <div className='menu sm:hidden block cursor-pointer' onClick={handleMobNav}>
                        <img src="src\assets\menu.svg" alt="" />
                    </div>
                    <div className='flex justify-center items-center h-14'>
                        <ul className=' list-none h-full text-base sm:flex sm:flex-row sm:gap-7 hidden '>
                            <li className='h-14'><a href="#" className='flex justify-center items-center h-full'>Home</a></li>
                            <li className='h-full'><a href="#" className='flex justify-center items-center h-full'>Report Issue</a></li>
                            <li className='h-full'><a href="#" className='flex justify-center items-center h-full'>Report a Bug</a></li>
                        </ul>
                    </div>
                    <ul className='mob-opt z-10 text-white sm:hidden list-none text-lg gap-3 absolute  -top-96 flex flex-col sm:gap-8 bg-blue-700 p-8' name='mobNav' style={{ top: isMoved ? '-384px' : '0px', height: isMoved ? 'auto' : '100%', transition: 'all 0.3s', left: '0px' }}>
                        <li><img src="src\assets\return.svg" alt="return" className='-mt-3' onClick={setIsMoved} /></li>
                        <li>Home</li>
                        <li>Report Issue</li>
                        <li>Report a Bug</li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Navbar