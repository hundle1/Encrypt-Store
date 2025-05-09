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
    name?: string;
    hashID?: string;
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
            updatedAt: query.updatedAt,
            name: query.name
        }
    });

    const res = await fetch(url);
    const products = await res.json();

    const clickData = await Promise.all(
        products.map(async (Product: Product) => {
            try {
                const clickRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${Product.id}/click`);
                if (!clickRes.ok) {
                    console.error(`Error fetching click count for product ${Product.id}:`, clickRes.status);
                    return { ...Product, clickCount: 0 };
                }

                const clickJson = await clickRes.json();
                return { ...Product, clickCount: clickJson.count || 0 };
            } catch (error) {
                console.error(`Failed to fetch click count for product ${Product.id}:`, error);
                return { ...Product, clickCount: 0 };
            }
        })
    );

    return clickData;
};



export default getProducts;