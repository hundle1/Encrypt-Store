import Container from "@/components/ui/container";
import Link from "next/link";
import Image from 'next/image'
import { MainNav } from "@/components";
import getCategories from "@/actions/get-categories";
import NavbarActions from "./navbar-actions";
import stackLogo from "./assets/stack-logo.jpg"
import { SearchBar } from "./search-bar";
import { HoverCard } from "./ui/hover-card";
import { HoverCardInfor } from "./hovercardinfor";
import { About } from "./about";
import { Policy } from "./policy";
export const revalidate = 0;

const Navbar = async () => {
    const categories = await getCategories();

    return (
        <div className="border-b">
            <Container>
                <div className="relative flex items-center h-16 px-4 sm:px-6 lg:px-8">
                    <Link href="http://localhost:3001" className="flex ml-4 lg:ml-0 gap-x-2">
                        <Image src={stackLogo} alt="logo" className="w-8 h-8" />
                        <p className="text-xl font-bold">STACK MARKET</p>
                    </Link>
                    <div className="pl-10 flex w-64 justify-between ">
                        <Policy />
                        <About />
                        <HoverCardInfor />
                    </div>
                    <NavbarActions />
                </div>
            </Container>
        </div>
    )
}
export default Navbar;