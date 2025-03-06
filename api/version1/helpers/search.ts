interface SearchObject {
    keyword: string;
    regex?: RegExp;
}

const searchHelper = (query: Record<string, any>): SearchObject => {
    let objectSearch: SearchObject = { keyword: "" };

    if (query.keyword) {  
        objectSearch.keyword = query.keyword as string;
        objectSearch.regex = new RegExp(objectSearch.keyword, "i"); // Không phân biệt chữ hoa/thường
    }

    return objectSearch;
};

export default searchHelper;
