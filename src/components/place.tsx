import Core from "./placeCards/core"
import AttendanceCard from "./placeCards/attendence"
import PayrollCard from "./placeCards/payroll"
export default function Place() {
    return(
        <div className="flex flex-col items-center justify-center mt-10 gap-5">
            <h1 className="text-3xl font-bold">Everything You Need in One Place</h1>
            <p className="text-md font-semibold text-gray-700">Pick & Choose module options as per your business needs. Every module complements each other and can work standalone too.</p>
            <div className="flex gap-5">
            <Core/>
            <AttendanceCard/>
            <PayrollCard/>
            </div>
        </div>
    )
}

