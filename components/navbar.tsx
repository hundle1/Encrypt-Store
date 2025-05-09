import Container from "@/components/ui/container";
import Link from "next/link";
import Image from 'next/image';
import { MainNav } from "@/components";
import getCategories from "@/actions/get-categories";
import NavbarActions from "./navbar-actions";
import stackLogo from "./assets/stack-logo.jpg";
import { SearchBar } from "./search-bar";
import { HoverCard } from "./ui/hover-card";
import { HoverCardInfor } from "./hovercardinfor";
import { About } from "./about";
import { Policy } from "./policy";
export const revalidate = 0;

const Navbar = async () => {
    const categories = await getCategories();

    return (
        <div className="border-b bg-white shadow-md sticky top-0 z-50">
            <Container>
                <div className="relative flex items-center h-16 px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out">
                    <Link href="http://localhost:3001" className="flex ml-4 lg:ml-0 gap-x-2 items-center transition-transform duration-300">
                        <Image src={stackLogo} alt="logo" className="w-10 h-10 rounded-full shadow-lg" />
                        <p className="text-xl font-bold text-neutral-800 transition-colors duration-300">STACK MARKET</p>
                    </Link>
                    <div className="pl-10 flex w-96 justify-between items-center">
                        <Policy />
                        <About />
                        <HoverCardInfor />
                        {/* Thêm link đến IDE */}
                        <Link href="/idenvironment" >
                            <div className="mt-1 flex no-wrap items-center text-neutral-600 hover:text-black  font-medium transition-all duration-300 cursor-pointer hover:scale-110">
                                Stack IDE&nbsp;
                            </div>
                        </Link>
                    </div>
                    <NavbarActions />
                </div>
            </Container>
        </div>
    );
};

export default Navbar;