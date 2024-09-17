export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
}

export interface Category {
    id: string;
    name: string;
    billboard: Billboard;
}

export interface Product {
    id: string;
    category: Category;
    name: string;
    price: string;
    createdAt: string;
    updatedAt: string;
    isFeatured: boolean;
    type: Type;
    creator: Creator;
    images: Image[]
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