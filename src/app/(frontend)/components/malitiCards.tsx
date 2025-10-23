
import { a, button } from "framer-motion/client"
import Button from "./buttons"
import { link } from "fs";

export default function Multicards() {
        const linkClassName = "transition-all cursor-pointer duration-300 ease-in-out mt-4 text w-[120px]";
    const Cards =[
        {
            url: "https://resourceinn.com/wp-content/uploads/2022/11/multi-lingual.webp",
            title:"Multi Lingual",
            description:"Helps you to build a culturally diverse workforce",
            button:<a href="https://resourceinn.com/multi-companies#localization"> <Button
            text="Learn more ➜"
            bgColor=" bg-none"
            textColor="  text-purple-600 hover:text-orange-700"
            className={linkClassName}
          /></a>
        },
        {
            url: "https://resourceinn.com/wp-content/uploads/2022/11/multi-currency.webp",
            title:"Multi Currency",
            description:"Enables you in making transactions with multiple currencies",
            button:<a href="https://resourceinn.com/multi-companies#multicurrency"><Button
            text="Learn more ➜"
            bgColor=" bg-none"
            textColor="  text-purple-600 hover:text-orange-700"
            className={linkClassName}
          /></a>
         
        },

        {
            url: "https://resourceinn.com/wp-content/uploads/2022/11/multi-companies.webp",            title:"Multi Company",
            description:"Provides a centralized view of HR operations across companies",
            button:<a href="https://resourceinn.com/multi-companies/"><Button
            text="Learn more ➜"
            bgColor=" bg-none"
            textColor="  text-purple-600 hover:text-orange-700"
            className={linkClassName}
          /></a>
        },
        {
            url: "https://resourceinn.com/wp-content/uploads/2022/12/dashboard-custom.webp",
            title:"Customize Dashboards",
            description:"Allow you to build your own dashboards with drag & drop options",
            button:<a href="https://resourceinn.com/multi-companies#customdashboard"><Button
            text="Learn more ➜"
            bgColor=" bg-none"
            textColor="  text-purple-600 hover:text-orange-700"
            className={linkClassName}
          />,</a>
        },
    ]
    return(
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
  {Cards.map((card, index) => (
    <div
      key={index}
      className="bg-white shadow-md rounded-xl p-4 flex flex-col hover:shadow-xl transition duration-300 w-64 h-56 max-w-sm"
    >
      <div className="flex items-center gap-3">
        <img
          src={card.url}
          alt={card.title}
          className="w-10 h-10 object-contain"
        />
        <h3 className="text-xl font-semibold">{card.title}</h3>
      </div>

      <p className="text-gray-600 text-lg mt-2">{card.description}</p>

      <div>{card.button}</div>
    </div>
  ))}
</div>


    
    )
}

