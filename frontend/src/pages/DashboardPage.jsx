import React from 'react'
import Header from '../component/header';
import DashboardDetailComponent from '../component/DashboardComponent/DashboardDetailComponent';

const DashboardPage = () => {
  return (
    <div>
        <Header/>
        <div className='bg-black h-screen w-screen'>
            <div className='flex justify-center items-center h-full'>
                <DashboardDetailComponent/>
            </div>
        </div>
    </div>
  )
}

export default DashboardPage