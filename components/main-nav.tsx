"use client"
import { cn } from '@/lib/utils';
import { Category, Type } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MainNavProps {
    data: Category[] | [];
    types: Type[];
}

const MainNav: React.FC<MainNavProps> = ({ data, types }) => {
    const pathname = usePathname();

    const routes = data.map(route => ({
        href: `/category/${route.id}`,
        label: route.name,
        active: pathname === `/category/${route.id}`,
    }));

    return (
        <nav className="flex items-center mx-6 space-x-4 lg:space-x-6">
            <div className="cursor-pointer text-sm font-medium transition-all text-neutral-500 hover:text-black hover:scale-105 hover:opacity-90 duration-[500ms] ease-in-out">
                All Items
            </div>
            {routes.map(route => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-all hover:text-black hover:scale-105 hover:opacity-90 duration-[500ms] ease-in-out",
                        route.active ? "text-black font-bold" : "text-neutral-500"
                    )}
                >
                    {route.label}
                </Link>
            ))}
            <div className="flex self-end items-end cursor-pointer text-sm font-medium transition-all text-neutral-500 hover:text-black hover:scale-105 hover:opacity-90 duration-[500ms] ease-in-out">
                STACK MARKET
                <div className="ml-1 self-end border bg-orange-600 rounded-full px-2 text-white text-sm font-medium transition-all hover:scale-105 hover:opacity-90 duration-[500ms] ease-in-out">
                    mall
                </div>
            </div>
        </nav>
    );
};

export default MainNav;
