import { FC } from 'react';
import useCartChecking from '@/hooks/use-check';
import Image from 'next/image';
import Button from '@/components/ui/button';
import Currency from '@/components/ui/currency';

interface CheckItemProps {
  data: any;
  onRemove: () => void; 
}

const CheckItem: FC<CheckItemProps> = ({ data, onRemove }) => {
  const removeItem = useCartChecking((state) => state.removeItem);

  const handleRemoveClick = () => {
    removeItem(data.id);
    onRemove(); 
  };

  return (
    <li className="flex items-center justify-between py-4">
      <div className="relative w-24 h-24 overflow-hidden rounded-md sm:h-48 sm:w-48">
        <Image fill src={data.images[0].url} alt="" className="object-cover object-center" />
      </div>
      <div className="relative flex flex-col justify-between flex-1 ml-4 sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">{data.name}</p>
          </div>
          <div className="flex mt-1 text-sm">
            <p className="text-gray-500">{data.createdAt}</p>
          </div>
          <div className="flex mt-1 text-sm">
            <p className="text-gray-500">{data.creator.name}</p>
            <p className="pl-4 ml-4 text-gray-500 border-l border-gray-200">{data.type.name}</p>
          </div>
          <Currency value={data.price} />
        </div>
      </div>
      <Button onClick={handleRemoveClick} className="text-black hover:text-red-600  bg-white border-solid border-2 border-black hover:border-red-600">
        Remove
      </Button>
    </li>
  );
};

export default CheckItem;
