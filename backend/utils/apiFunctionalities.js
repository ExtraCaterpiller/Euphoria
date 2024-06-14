class ApiFunctionalities {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}

        this.query = this.query.find({...keyword})
        return this
    }

    searchCategory(){
        if(this.queryStr.category){
            this.query = this.query.where('category').equals(this.queryStr.category)
        }

        return this
    }

    gender(){
        if(this.queryStr.gender){
            this.query = this.query.where('gender').equals(this.queryStr.gender)
        }

        return this
    }

    style(){
        if(this.queryStr.style){
            this.query = this.query.where('style').equals(this.queryStr.style)
        }

        return this
    }

    filter(){
        const queryCopy = {...this.queryStr}
        const removeFields = ["keyword","page","limit"]
        removeFields.forEach((key) => delete queryCopy[key])

        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

        this.query = this.query.find(JSON.parse(queryStr));

        return this
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1

        const skip = resultPerPage*(currentPage-1)

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}

module.exports = ApiFunctionalities