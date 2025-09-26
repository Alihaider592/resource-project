import Typewriter from "./typewritter"
export default function Hero() {
    return(
        <div>
            <img className="z-10 relative " src="https://resourceinn.com/wp-content/uploads/2022/12/header-cover.webp" alt="" />
            
            <div className="flex justify-between">
            {/* left session */}
            <div className="w-[50%] border-2 h-[555px] p-5 z-30 border-black absolute top-[85px]">
            <div className=" text-7xl font-bold"> Redefine Your</div>
            <div className="text-7xl font-bold">HR Potential</div>
            <Typewriter/>
            </div>
            {/* right session */}
            <div className="w-[50%] right-0 h-[555px] border-2  z-30 border-black absolute top-[85px]">
                <img className="z-20 w-[55%] h-[555px] right-32 absolute  " src="https://resourceinn.com/wp-content/uploads/2022/12/header-image-side.webp" alt="" />
            
            </div>
            </div>
        </div>
    )
}