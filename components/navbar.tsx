import Container from "@/components/ui/container";
import Link from "next/link";
import Image from 'next/image'
import { MainNav } from "@/components";
import getCategories from "@/actions/get-categories";
import NavbarActions from "./navbar-actions";
import stackLogo from "./assets/stack-logo.jpg"
export const revalidate = 0;

const Navbar = async () => {
    const categories = await getCategories();

    return (
        <div className="border-b">
            <Container>
                <div className="relative flex items-center h-16 px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex ml-4 lg:ml-0 gap-x-2">
                        <Image src={stackLogo} alt="logo" className="w-8 h-8" />
                        <p className="text-xl font-bold">STACK MARKET</p>
                    </Link>
                    <MainNav data={categories || []} />
                    <NavbarActions />
                </div>
            </Container>
        </div>
    )
}
export default Navbar;