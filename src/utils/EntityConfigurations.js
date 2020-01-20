export const productConfig = {
    title: "Product",
    entityName: "product",
    id: "id",
    fieldNames: [
        { name: "name" }, { name: "code" },
        { name: "description" }, { name: "unit.name" },
        { name: "price", type: "number" }, { name: "category.name" }
    ],
    formData: [
        {
            lableName: "Product Name",
            inputType: "text",
            name: "name"
        },
        {
            lableName: "Product Code",
            inputType: "text",
            name: "code"
        },
        {
            lableName: "Product Description",
            inputType: "textarea",
            name: "description"
        },
        {
            lableName: "Product Unit",
            inputType: "dynamicDropdown",
            name: "unit.name",
            reffEntity: "Unit",
            idField: "id",
            displayField: "name"
        },
        {
            lableName: "Product Price",
            inputType: "number",
            name: "price"
        },
        {
            lableName: "Product Category",
            inputType: "dynamicDropdown",
            name: "category.name",
            reffEntity: "Category",
            idField: "id",
            displayField: "name"
        }
    ]
}
export const supplierList = {
    title: "Supplier",
    entityName: "supplier",
    id: "id",
    fieldNames: [
        { name: "name" }, { name: "address" }, { name: "contact" }, { name: "website", type: "link" },
        { name: "iconUrl", type: "image" }
    ],
    formData: [
        {
            lableName: "Supplier Name",
            inputType: "text",
            name: "name"
        },
        {
            lableName: "Supplier Address",
            inputType: "textarea",
            name: "address"
        },
        {
            lableName: "Supplier Contact",
            inputType: "text",
            name: "contact"
        },
        {
            lableName: "Supplier Icon",
            inputType: "singleImage",
            name: "iconUrl"
        },
        {
            lableName: "Supplier Website",
            inputType: "text",
            name: "website"
        }
    ]
}
export const customerList = {
    title: "Customer",
    entityName: "customer",
    id: "id",
    fieldNames: [
        { name: "username" }, { name: "name" }, { name: "address" }, { name: "phone" }, { name: "email" }
    ],
    formData: [
        {
            lableName: "Customer Unique Name",
            inputType: "text",
            name: "username"
        },
        {
            lableName: "Customer Name",
            inputType: "text",
            name: "name"
        },
        {
            lableName: "Customer Address",
            inputType: "textarea",
            name: "address"
        },
        {
            lableName: "Customer Phone",
            inputType: "text",
            name: "phone"
        },
        {
            lableName: "Customer Email",
            inputType: "email",
            name: "email"
        }
    ]
}

