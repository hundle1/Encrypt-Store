import { Creator } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/creators`

const getCreators = async (): Promise<Creator[]> => {
    const res = await fetch(URL);
    return res.json();
}

export default getCreators;