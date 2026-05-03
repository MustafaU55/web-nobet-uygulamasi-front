import MobileBottomBar from "../../../components/mobile_bottom_bar";
import Sidebar from "../../../components/sidebar_left";
import DepartmentManager from "../DepartmentManager";



export default function DepartmanPage() {
return (
<div className="min-h-screen bg-blue-300">
           <Sidebar/>

<div className="text-black flex-1 xl:ml-[40vh] pb-24 xl:pb-2 px-2 sm:px-10 pt-10  bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
    <DepartmentManager /> {/* DepartmentManager bileşenini kullan */}
</div>
<MobileBottomBar />

</div>
)
}