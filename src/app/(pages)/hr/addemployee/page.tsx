"user client"
import React from 'react';
import AddUserForm from '@/app/(forntend)/components/form/addusers';
const page = () => {
  return (
    <div className='p-5'>
      <div className='text-4xl font-bold flex'>
        {/* Add  */}
        {/* <div className='text-4xl justify-center items-baseline-last gap-1 flex font-bold ml-1 text-purple-800'>Users <hr className=' w-20 bg-purple-900' /></div> */}
      </div>
      <div>
        <AddUserForm/>
      </div>
    </div>
  );
}

export default page;
