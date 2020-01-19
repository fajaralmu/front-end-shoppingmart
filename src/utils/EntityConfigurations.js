export const productConfig = {
    title:"Product",
    entityName:"product",
    id:"id",
    fieldNames:[
        "name","description","unit.name","price","category.name"
    ],
    formData:[
        {
            lableName:"Product Name",
            inputType:"text"
        },
        {
            lableName:"Product Description",
            inputType:"textarea"
        },
        {
            lableName:"Product Unit",
            inputType:"text"
        },
        {
            lableName:"Product Price",
            inputType:"number"
        },
        {
            lableName:"Product Category",
            inputType:"text"
        }
    ]
}
export const supplierList = {
    title:"Supplier",
    entityName:"supplier",
    id:"id",
    fieldNames:[
        "name","address","contact","website","iconUrl"
    ],
    formData:[
        {
            lableName:"Supplier Name",
            inputType:"text"
        },
        {
            lableName:"Supplier Address",
            inputType:"textarea"
        },
        {
            lableName:"Supplier Contact",
            inputType:"text"
        },
        {
            lableName:"Supplier Website",
            inputType:"text"
        } 
    ]
}
export const customerList = {
    title:"Customer",
    entityName:"customer",
    id:"id",
    fieldNames:[
        "username","name","address","phone","email"
    ],
    formData:[
        {
            lableName:"Customer Unique Name",
            inputType:"text"
        },
        {
            lableName:"Customer Name",
            inputType:"text"
        },
        {
            lableName:"Customer Address",
            inputType:"textarea"
        },
        {
            lableName:"Customer Contact",
            inputType:"text"
        },
        {
            lableName:"Customer Email",
            inputType:"email"
        } 
    ]
}

 