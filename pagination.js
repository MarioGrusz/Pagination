/**
 *
 * @param {Number} limit
 * @param {Object} filter
 * @param {Number} page
 * @param {String} searchTerm
 * @param {Boolean} isNew
*/


function isEmptyObject(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};


const findPaginatedProducts = async (limit, page, filters, searchTerm, sort, isNew) => {

    try{

        const noFiltersPage = page;
        let options = {
            page: page,
            limit: limit, 
            sort: sort, 
        };


    
        if (searchTerm) {

            filters = {
                $and: [
                    filters,
                    {
                        $or: [
                            { shopName: { $regex: searchTerm, $options: 'i' } },
                            { productOrigin: { $regex: searchTerm, $options: 'i' } }
                        ]
                    },
                ]
            };
        };
   
        if (isNew) {
            filters = {
                ...filters,
                class: 'new'
            };
        };
        
        //Check if filter object is empty
        function isEmptyObject(obj) {
            for (let key in obj) {
              if (obj.hasOwnProperty(key)) {
                return false;
              }
            }
            return true;
        } 

        const totalCount = await coffeeProduct.countDocuments(filters);

        options.page = !isEmptyObject(filters) ? 1 : noFiltersPage;
        options.limit = !isEmptyObject(filters) ? totalCount : limit;
        
        const coffeeData = await coffeeProduct.paginate(filters, options)

        return coffeeData;
   

    } catch (error) {
        console.error('Error in findPaginatedProducts:', error);
        throw new Error('An error occurred while fetching coffee products.');
    }
};

export { findPaginatedProducts };
