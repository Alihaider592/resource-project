import Button from "./buttons"
export default function Cando() {
    return(
        <div className=" bg-gradient-to-b from-purple-800 to-purple-500  items-center  text-white h-[10rem] w-[80%] m-10 sm:py-36 rounded-lg shadow-inner flex flex-col justify-center bg-blue-950">
            <h1 className="text-4xl font-extrabold mt-20  ">Interested in What ResourceInn Can Do for You?</h1>
            <h2 className="text-2xl">Build Your Custom HR Experience</h2>
<a href="https://resourceinn.com/free-trial/">
 <Button
            text="→ Get Free Trial"
            textColor=" text-white hover:text-white"
            bgColor="bg-orange-500 hover:bg-purple-500 transition-all duration-300 ease-in-out"
            className="cursor-pointer hover:-translate-y-2 hover:shadow-lg w-[150px] m-5 ml-0 h-[50px]  border-3 hover:border-purple-500 transition-all duration-300 ease-in-out border-orange-500"
          />
          </a>
          <img className="ml-[50%] w-32  mb-8" src="https://resourceinn.com/wp-content/uploads/2022/12/registration-envelope.png" alt="" />
        </div>
    )
}