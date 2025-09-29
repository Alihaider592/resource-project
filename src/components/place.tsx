import Core from "./placeCards/core"
import RecruitmentCard from "@/components/placeCards/recurment"
import PerformanceCard from "@/components/placeCards/performance"
import AttendanceCard from "./placeCards/attendence"
import PayrollCard from "./placeCards/payroll"
import TrainingCard from "./placeCards/training"
export default function Place() {
    return(
        <div className="flex flex-col items-center justify-center mt-10 gap-5">
            <h1 className="text-3xl font-bold">Everything You Need in One Place</h1>
            <p className="text-md font-semibold text-gray-700">Pick & Choose module options as per your business needs. Every module complements each other and can work standalone too.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
            <Core/>
            <AttendanceCard/>
            <PayrollCard/>
             <PerformanceCard/>
               <RecruitmentCard/>
               <TrainingCard/>
            </div>
        </div>
    )
}

