import { TbReportSearch, TbLayoutDashboardFilled } from "react-icons/tb";
import { MdAdd } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";

export const menuItems = [
  { to: "/", label: "Dashboard", icon: TbLayoutDashboardFilled },
  { to: "/leads", label: "Leads", icon: HiOutlineDocumentReport },
  { to: "/add-lead", label: "Add Leads", icon: MdAdd },
  { to: "/agents", label: "Sales Agent", icon: IoPersonSharp },
  { to: "/reports", label: "Reports", icon: TbReportSearch },
];
