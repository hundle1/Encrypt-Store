"use client"
import { cn } from '@/lib/utils';
import { Category, Type } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

interface MainNavProps {
    data: Category[] | [],
    types: Type[]
}

const MainNav: React.FC<MainNavProps> = ({ data, types }) => {
    const pathname = usePathname();

    const routes = data.map(route => ({
        href: `/category/${route.id}`,
        label: route.name,
        active: pathname === `/category/${route.id}`
    }))

    return (
        <nav className='flex items-center mx-6 space-x-4 lg:space-x-6'>
            {routes.map(route => (
                <Link key={route.href} href={route.href} className={cn('text-sm font-medium transition-colors hover:text-black', route.active ? 'text-black font-bold' : 'text-neutral-500')}>
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}

export default MainNav;