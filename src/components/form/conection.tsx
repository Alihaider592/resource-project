import React from 'react';
import Button from '../buttons';
const Conection = () => {
  return (
    <div className=' flex justify-center items-center p-20 bg-gradient-to-b  from-purple-800 to-purple-500  w-full'>
      <div className=''><img className='bg-gray-200 rounded-l-3xl p-4.5' src="https://resourceinn.com/wp-content/uploads/2023/01/footer-trial-form-01.webp" alt="" /></div>
      <div className='rounded-r-3xl p-10 bg-white flex flex-col justify-center items-center'>
        <p className='text-4xl font-bold'>Let’s Connect Today </p>
        <form className=' flex flex-col gap-5' action="post">
            <div className='flex gap-5'>
            <div className=''>
            <p className='mb-1'>Name</p>
            <input className='h-[40px] rounded-sm border-2 border-gray-400 w-[250px]' type="text" name='Name' />
            </div>
            <div className=''>
            <p className='mb-1'>Email</p>
            <input className='h-[40px] rounded-sm border-2 border-gray-400 w-[250px]' type="text" name='Name' />
            </div>
            </div>
            <div className='flex gap-5'>
            <div className=''>
            <p className='mb-1'>Phone Number</p>
            <input className='h-[40px] rounded-sm border-2 border-gray-400 w-[250px]' type="text" name='Name' />
            </div>
            <div className=''>
            <p className='mb-1'>Company Name</p>
            <input className='h-[40px] rounded-sm border-2 border-gray-400 w-[250px]' type="text" name='Name' />
            </div>
            </div>
            <div>
                <p className='mb-1'>Tell us about your requirements</p>
                <textarea className='rounded-sm border-gray-400  border-2 w-full h-[150px]' name="area" id="area"></textarea>
            </div>
        <Button
            text="Schedule a Call"
            textColor=" text-white hover:text-white"
            bgColor="bg-orange-500 hover:bg-purple-500 transition-all duration-300 ease-in-out"
            className=" hover:-translate-y-2 cursor-pointer hover:shadow-lg w-[170px] m-5 ml-0 h-[50px]  border-3 hover:border-purple-500 transition-all duration-300 ease-in-out border-orange-500"
          />
        </form>
     </div>
    </div>
  );
}

export default Conection;