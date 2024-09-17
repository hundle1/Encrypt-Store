import { Product } from "@/types";
import qs from 'query-string';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
    categoryId?: string;
    creatorId?: string;
    typeId?: string;
    isFeatured?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const getProducts = async (query: Query): Promise<Product[]> => {
    const url = qs.stringifyUrl({
        url: URL,
        query: {
            creatorId: query.creatorId,
            typeId: query.typeId,
            categoryId: query.categoryId,
            isFeatured: query.isFeatured,
            createdAt: query.createdAt,
            updatedAt: query.updatedAt
        }
    })
    const res = await fetch(url);
    return res.json();
}

export default getProducts;