import Link from "next/link"
import Button from "./buttons"
export default function Navbar() {
    return(
        <div className="sticky top-0 z-50 bg-white shadow" >
            <div className=" p-5 items-center justify-between flex ">
            <div className="flex gap-7 items-center ">
            <img  src="https://resourceinn.com/wp-content/uploads/2020/01/LOGO-01-TM.svg" className="w-50 wp-image-25823" alt="Resourceinn HR software logo - Smart business empowerment solutions."></img>
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
                <div>
                <Link className="flex gap-0.5" href={'/resources'}><li>Resources</li><img className="w-2 relative top-3 h-2" src="/images/down-arrow.png" alt="" /></Link>
                </div>
                <div>
                <Link className="flex gap-0.5" href={'/associations'}><li>Associations</li><img className="w-2 relative top-3 h-2" src="/images/down-arrow.png" alt="" /></Link>
                </div>
                <div>
                <Link className="flex gap-0.5" href={'/about'}><li>About Us</li><img className="w-2 relative top-3 h-2" src="/images/down-arrow.png" alt="" /></Link>
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
      {/* <hr className="bg-gray w-full "/> */}
        </div>
    )
}