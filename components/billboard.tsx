import { Billboard as BillboardType } from '@/types';
import slider1 from "./assets/slider1.jpg"
import slider2 from "./assets/slider2.jpg"
import Image from 'next/image';
interface BillboardProps {
    data: BillboardType
};

const Billboard: React.FC<BillboardProps> = ({ data }) => {
    return (
        <div className='p-4 overflow-hidden sm:p-6 lg:p-8 rounded-xl'>
            <div
                className='rounded-xl  aspect-square md:aspect-[4.7/1] overflow-hidden'
                style={{ backgroundImage: `url(${data?.imageUrl})` }}>
                <div className='flex flex-col items-center justify-center w-full h-full text-center gap-y-8'>
                    <div className='max-w-xs text-3xl font-bold sm:text-5xl lg:text-6xl sm:max-w-xl'>
                        {data?.label}
                    </div>
                </div>
            </div>
            {/* <div className='flex rounded-xl aspect-square md:aspect-[4.7/1] overflow-hidden bg-slate-300'>
                <Image src={slider1} alt="logo" className="w-fit h-full" />
                <div className='flex flex-col w-full h-full ml-8'>
                    <div className="flex gap-y-6 mt-9 ml-8 w-full h-full justify-around">
                        <div className="items-center gap-x-1">
                            <h1 className="font-semibold text-black mt-7 text-9xl">Test NFT 1</h1>
                        </div>
                        <div className="items-center gap-x-6">
                            <h1 className="font-semibold text-black mt-7 ">Type of Product: WEB PRODUCT</h1>
                            <h1 className="font-semibold text-black mt-7">Creator: Dũng Nguyễn</h1>
                            <h1 className="font-semibold text-black mt-7">Mint Time: 2024-11-14T13:01:10.918Z</h1>
                        </div>
                    </div>
                    <div className="flex gap-y-6 mt-9 ml-8 w-full h-full">
                        <div className="items-center gap-x-4">
                            <h1 className="font-semibold text-black mt-7 text-2xl">Describe:</h1>
                            <h3 className="font-semibold text-black mt-7">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequa</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex rounded-xl aspect-square md:aspect-[4.7/1] overflow-hidden bg-slate-300'>
                <Image src={slider2} alt="logo" className="w-fit h-full" />
                <div className='flex flex-col w-full h-full ml-8'>
                    <div className="flex gap-y-6 mt-9 ml-8 w-full h-full justify-around">
                        <div className="items-center gap-x-1">
                            <h1 className="font-semibold text-black mt-7 text-9xl">Test NFT 2</h1>
                        </div>
                        <div className="items-center gap-x-6">
                            <h1 className="font-semibold text-black mt-7 ">Type of Product: WEB PRODUCT</h1>
                            <h1 className="font-semibold text-black mt-7">Creator: Dũng Nguyễn</h1>
                            <h1 className="font-semibold text-black mt-7">Mint Time: 2024-11-14T13:01:10.918Z</h1>
                        </div>
                    </div>
                    <div className="flex gap-y-6 mt-9 ml-8 w-full h-full">
                        <div className="items-center gap-x-4">
                            <h1 className="font-semibold text-black mt-7 text-2xl">Describe:</h1>
                            <h3 className="font-semibold text-black mt-7">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, ga uiayu  aygy auuygha uya u  guaoi ayhu aig uaiuh iaiua ised do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequa</h3>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default Billboard;