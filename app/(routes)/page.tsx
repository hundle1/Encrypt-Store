import Container from "@/components/ui/container";
import Billboard from "@/components/billboard";
import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import CollectionList from "@/components/collection_list";
import getCreatorss from "@/actions/get-creatorss";

export const revalidate = 0;

const HomePage = async () => {
    const billboard = await getBillboard('7dd23100-16be-4a95-aeed-f7037cc05999');
    const products = await getProducts({ isFeatured: true })
    const creators = await getCreatorss({})
    return (
        <Container>
            <div className="pb-10 space-y-10">
                <Billboard data={billboard} />
                <div className="flex flex-col px-4 gap-y-8 sm:px-6 lg:px-8">
                    <ProductList title="Featured Products" items={products} />
                </div>
                {/* <div className="flex flex-col px-4 gap-y-8 sm:px-6 lg:px-8">
                    <CollectionList title="Featured Collection" items={creators} />
                </div> */}
            </div>
        </Container>
    )
}

export default HomePage;