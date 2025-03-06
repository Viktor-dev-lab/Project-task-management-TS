interface ObjectPagination {
    currentPage: number,
    limitItem: number,
    skip?: number,
    totalPage?: number
}


const paginationHelper = (objectPagination : ObjectPagination, query: Record<string, any> , countItem: number) : ObjectPagination => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    if (query.limit) {
        objectPagination.limitItem = parseInt(query.limit);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * (objectPagination.limitItem); // Công thức phân trang

    const totalPage = Math.ceil(countItem / objectPagination.limitItem); // Tính tổng trang

    objectPagination.totalPage = totalPage; // Thêm vào object

    return objectPagination;
}

export default paginationHelper;