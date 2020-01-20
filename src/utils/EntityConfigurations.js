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
            inputType:"text",
            name:"name"
        },
        {
            lableName:"Product Description",
            inputType:"textarea",
            name:"description"
        },
        {
            lableName:"Product Unit",
            inputType:"dynamicDropdown",
            name:"unit.name",
            reffEntity:"Unit", 
        },
        {
            lableName:"Product Price",
            inputType:"number",
            name:"price"
        },
        {
            lableName:"Product Category",
            inputType:"dynamicDropdown",
            name:"category.name",
            reffEntity:"Category", 
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
            inputType:"text",
            name:"name"
        },
        {
            lableName:"Supplier Address",
            inputType:"textarea",
            name:"address"
        },
        {
            lableName:"Supplier Contact",
            inputType:"text",
            name:"contact"
        },
        {
            lableName:"Supplier Website",
            inputType:"text",
            name:"website"
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
            inputType:"text",
            name:"username"
        },
        {
            lableName:"Customer Name",
            inputType:"text",
            name:"name"
        },
        {
            lableName:"Customer Address",
            inputType:"textarea",
            name:"address"
        },
        {
            lableName:"Customer Phone",
            inputType:"text",
            name:"phone"
        },
        {
            lableName:"Customer Email",
            inputType:"email",
            name:"email"
        } 
    ]
}

 