import React from 'react';
import Link from 'next/link';
const Start = () => {
  return (
    <div className=''>
        <div className='flex p-10'>
      <div className='W-[60%]  flex flex-col gap-14 p-20 h-[800px]'> 
        <div className=''>
        <h1 className='text-5xl m-5 font-bold '>How it all started</h1>
        <h2 className='text-mg '> <Link className='text-purple-800 hover:underline' href={'/'}>Resourceinn</Link> was launched in 2016 by three visionary individuals, Mr.
Ahsan Salal and his partners. The aim was to create an HR product
dedicated to simplifying HR operations and driving business growth. The leading software revolutionizes the HR landscape by combining
data-driven practices with a culture of success.
By collecting and analyzing data, this tool helps HR in making informed
decisions to create a better and more successful work environment.</h2>
        </div>
<div className='gap-10 flex flex-col'>
    <h1 className='text-4xl font-bold'>Our Commitment</h1>
    <h1 className='test-md font-bold h-20 w-60 ml-20 m-5'>Ensuring a Culture of Success Supported by Data-Driven HR Practices Empowering HR managers to: </h1>
    <div className='text-md text-gray-500 ml-32'>
<h1> Automate tasks</h1>
<h1>Streamline processes</h1>
<h1> Leverage data for strategic decision-making</h1>
    </div>
</div>
      </div>
      <div className='W-[40%] p-20  h-[400px]' >
        <img className='w-[2800px]' src="https://resourceinn.com/wp-content/uploads/2022/09/aboutus-768x587-1.jpg" alt="" />
      </div>
      </div>
      <div className='flex m-10 justify-center items-center  gap-10'>
        <div className='h-60 w-[40%] bg-gray-200 p-10 rounded-4xl'>
            <h1 className='text-4xl font-bold '>Our Vision</h1>
            <h1 className='text-lg mt-10'>Resourceinn helps businesses scale by enabling HR to make the right choices.</h1>
        </div> 
        <div className='p-10 h-60 text-white w-[40%] bg-purple-400 rounded-4xl'>
            <h1 className='text-4xl font-bold'>We are on a Mission</h1>
            <h1 className='text-lg mt-10'>To help HR ease up its operations and shape towards a progressive culture along with valuable insights for mid-sized businesses.</h1>
        </div>
      </div>
      <div className='p-20 flex gap-40'>
        <div className='w-[30%]'>
            <img className='ml-20' src="https://resourceinn.com/wp-content/uploads/2023/07/drector-team.jpg" alt="" />
        </div>
        <div className='w-[50%] flex flex-col gap-10 p-15'> <h1 className='text-5xl font-bold'>	
Our Leadership Team
</h1>
<h1 className='text-lg '>Resourceinn is co-founded by M. Ahsan, M. Abdullah and Noman Hassan. </h1>
</div>
      </div>
    </div>
  );
}

export default Start;