import Container from "@/components/ui/container";
import getCategories from "@/actions/get-categories";
import getTypes from "@/actions/get-types";
import getProducts from "@/actions/get-products";
import MainNav from "./main-nav";
import { SearchBar } from "./search-bar";  // import từ file vừa tạo ở trên

export const revalidate = 0;

const Category = async () => {
    // Lấy dữ liệu cần thiết
    const categories = await getCategories();
    const types = await getTypes();
    const products = await getProducts({}); // Lấy toàn bộ sản phẩm (hoặc theo query tuỳ ý)

    return (
        <div className="border-b">
            <Container>
                <div className="relative flex items-center h-16 px-4 sm:px-6 lg:px-8 justify-between">
                    <div className="w-1/12" />
                    <MainNav data={categories || []} types={types} />
                    <SearchBar/>
                </div>
            </Container>
        </div>
    );
};

export default Category;
