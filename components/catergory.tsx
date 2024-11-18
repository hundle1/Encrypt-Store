import Container from "@/components/ui/container";
import Link from "next/link";
import Image from 'next/image'
import getCategories from "@/actions/get-categories";
import NavbarActions from "./navbar-actions";
import stackLogo from "./assets/stack-logo.jpg";
import { SearchBar } from "./search-bar";
import getTypes from "@/actions/get-types";
import MainNav from "./main-nav";
export const revalidate = 0;

const Category = async () => {
    const categories = await getCategories();
    const types = await getTypes();

    return (
        <div className="border-b">
            <Container>
                <div className="relative flex items-center h-16 px-4 sm:px-6 lg:px-8">
                    <div className="w-1/12" />
                    <MainNav data={categories || []} types={types} />
                    {/* <SearchBar /> */}
                    <div className="w-4/12" />
                </div>
            </Container>
        </div>
    )
}
export default Category;