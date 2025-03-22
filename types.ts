export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
}

export interface Category {
    products: any;
    id: string;
    name: string;
    billboard: Billboard;
}

export interface Product {
    id: string;
    category: Category;
    name: string;
    describe: string;
    price: string;
    createdAt: string;
    updatedAt: string;
    isFeatured: boolean;
    type: Type;
    creator: Creator;
    images: Image[];
    clickCount: number;  // 👈
}

export interface Image {
    id: string;
    url: string;
}

export interface Type {
    id: string;
    name: string;
}
export interface Creator {
    id: string;
    name: string;
}

export interface Order {
    id: string;
    createdAt: string;
    updatedAt: string;
}