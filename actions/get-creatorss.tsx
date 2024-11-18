import { Creator } from "@/types";
import qs from 'query-string';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/creators`;

interface Query {
    createdAt?: string;
    updatedAt?: string;
}

const getCreators = async (query: Query): Promise<Creator[]> => {
    const url = qs.stringifyUrl({
        url: URL,
        query: {
            createdAt: query.createdAt,
            updatedAt: query.updatedAt
        }
    })
    const res = await fetch(url);
    return res.json();
}

export default getCreators;