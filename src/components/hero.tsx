import Typewriter from "./typewritter"
import Button from "./buttons"
export default function Hero() {
    return(
        <div className="text-white">
            <img className="z-10 relative " src="https://resourceinn.com/wp-content/uploads/2022/12/header-cover.webp" alt="" />
            
            <div className="flex justify-between">
            {/* left session */}
            <div className="w-[50%]  h-[555px] p-8 z-30  absolute top-[85px]">
            <div className=" text-7xl font-extrabold"> Redefine Your</div>
            <div className="text-7xl font-extrabold">HR Potential</div>
            <Typewriter/>
            <div className="w-[70%] text-lg">
                <p>
                    Optimize every stage of your growth by building a progressive culture with All in one HR solution from Resourceinn.
                </p>
            </div>
            <Button 
        text="Free Trial" 
        textColor=" text-white hover:text-white" 
        bgColor="bg-orange-500 hover:bg-purple-500 transition-all duration-300 ease-in-out" 
        className=" w-[130px] m-5 ml-0 h-[50px] border-3 hover:border-purple-500 transition-all duration-300 ease-in-out border-orange-500"
        />
      <Button 
        text="Get Free Consultation" 
        textColor=" text-white hover:text-white" 
        bgColor="bg-prple-500  transition-all duration-300 ease-in-out" 
        className=" w-[210px] m-5 ml-0 h-[50px] border-3 transition-all duration-300 ease-in-out border-white-500"
        />
        <p>* No credit card required</p>
            </div>
            {/* right session */}
            <div className="w-[50%] right-0 h-[555px] z-30  absolute top-[85px]">
                <img className="z-20 w-[55%] h-[555px] right-32 absolute  " src="https://resourceinn.com/wp-content/uploads/2022/12/header-image-side.webp" alt="" />
            
            </div>
            </div>
        </div>
    )
}