import Link from "next/link"
import Button from "./buttons" // Assuming 'Button' component exists

export default function Navbar() {
     const menuStyles = `
        /* 1. Animation Keyframes: Slides down and fades in simultaneously */
        @keyframes slideInFade {
            0% {
                opacity: 0;
                transform: translateY(-10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* 2. Base state: Hidden and off-set */
        .dropdown-menu {
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
        }

        /* 3. Hover state: Show and animate */
        .dropdown-container:hover .dropdown-menu {
            visibility: visible;
            opacity: 1;
            /* Use the keyframe animation for a smooth, single-run effect on display */
            animation: slideInFade 0.3s ease-out forwards;
        }

        /* 4. Link hover state for smooth color change */
        .menu-link:hover {
            color: #ae56ff; /* Match one of the 3D background colors */
        }
    `;

    return(
        <div className="sticky top-0 z-50 bg-white shadow" >
            
            <style dangerouslySetInnerHTML={{ __html: menuStyles }} />
            
            <div className=" p-5 items-center justify-between flex ">
            <div className="flex gap-7 items-center ">
           <Link href={'/'}> <img  src="https://resourceinn.com/wp-content/uploads/2020/01/LOGO-01-TM.svg" className="w-50 wp-image-25823" alt="Resourceinn HR software logo - Smart business empowerment solutions."></img></Link>
            <ul className="flex gap-5">
                <div>
                <Link href={'/'}><li>Home</li></Link>
                </div>
                
               
                <div className="flex">
                <Link className="flex gap-0.5" href={'/solutions'}><li>Solutions </li><img className="w-2 relative top-3 h-2" src="/images/down-arrow.png" alt="" /> </Link>
                </div>
                
                <div className="flex">
                <Link href={'/pricing'}><li>Pricing</li>
                </Link>
                </div>
                
               
                <div>
                <Link className="flex gap-0.5" href={'/services'}><li>Services</li><img className="w-2 relative top-3 h-2" src="/images/down-arrow.png" alt="" /></Link>
                </div>
                
               
                <div id="manu1" className="relative dropdown-container"> 
                    <Link className="flex gap-0.5" href={'#'}><li>Resources</li><img className="w-2 relative top-3 h-2" src="/images/down-arrow.png" alt="" /></Link>
               
                    <div className='absolute dropdown-menu pt-4 z-50'> 
                        <div className='flex flex-col p-5 gap-2 w-36 bg-white shadow-2xl shadow-black rounded'> 
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn.com/hr-blog/">Our Blog</a>
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn-support.atlassian.net/servicedesk/customer/portal/3">Help-Desk</a>
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn.com/hr-glossary/">HR-Glossary</a>
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn.com/income-tax-calculator-pakistan/">Income Tax Calculator Pakistan</a>
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn.com/write-for-us/">Write For Us</a>
                        </div>
                    </div>
                </div>
                
               
                <div id="manu2" className="relative dropdown-container"> 
                    <Link className="flex gap-0.5" href={'#'}><li>Associations</li><img className="w-2 relative top-3 h-2" src="/images/down-arrow.png" alt="" /></Link>
               
                    <div className='absolute dropdown-menu pt-4 z-50'> 
                        <div className='flex flex-col p-5 gap-2 w-36 bg-white shadow-2xl shadow-black rounded'> 
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn.com/pasha-membership/">Pasha</a>
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn.com/fast-nuces/">Fast-Nuces</a>
                        </div>
                    </div>
                </div>
                
               
                <div id="manu3" className="relative dropdown-container"> 
                    <Link className="flex gap-0.5" href={'/about'}><li>About Us</li><img className="w-2 relative top-3 h-2" src="/images/down-arrow.png" alt="" /></Link>
                   
                    <div className='absolute dropdown-menu pt-4 z-50'> 
                        <div className='flex flex-col p-5 gap-2 w-36 bg-white shadow-2xl shadow-black rounded'> 
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn.com/about-us/">Our Story</a>
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn.com/clients/">Our Client</a>
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn.com/become-a-partner/">Resourceinn Partners Program</a>
                            <a className='cursor-pointer hover:text-purple-700 menu-link' href="https://resourceinn.com/contact-us/">Contact Us</a>
                        </div>
                    </div>
                </div>
                
                <div>
                    <Link className="flex gap-0.5 font-bold text-orange-500 hover:text-purple-600"  href={'/hiring'}>We are hiring!</Link>
                </div>
            </ul>
            </div>
            <div className="flex gap-3 ">
             <Button 
        text="Book a Demo" 
        textColor="text-sm transition-all duration-300 ease-in-out text-orange-500 hover:text-white" 
        bgColor="transition-all duration-300 ease-in-out hover:bg-orange-500" 
        className="   border-3"
      />
      <Button 
        text="Get Support" 
        textColor="text-sm text-white transition-all duration-300 ease-in-out" 
        bgColor="bg-purple-800 hover:bg-purple-500 transition-all duration-300 ease-in-out" 
        className="  "
      />
      </div>
      </div>
        </div>
    )
}
