export const productConfig = {
    title: "Product",
    entityName: "product",
    id: "id",
    fieldNames: [
        { name: "name" }, { name: "code" },
        { name: "description" }, { name: "unit.name" },
        { name: "price", type: "number" }, { name: "category.name" },
        { name: "imageUrl", type: "imageMultiple" }
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
            lableName: "Product Image(s)",
            inputType: "multipleImage",
            name: "imageUrl"
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
    ],
    "groupNames": null,
    "entityName": "product",
    "alias": " Product",
  //  "fieldNames": "[\"code\",\"name\",\"description\",\"price\",\"type\",\"imageUrl\",\"unit\",\"category\",\"id\"]",
    "idField": "id",
    "detailFieldName": "",
    "imageElementsJson": "[\"imageUrl\"]",
    "dateElementsJson": "[]",
    "multipleSelectElementsJson": "[]",
    "currencyElementsJson": "[\"price\"]",
    "formInputColumn": 1,
    "editable": true,
    "withDetail": false,
    "dateElements": [],
    "imageElements": [
        "imageUrl"
    ],
    "currencyElements": [
        "price"
    ],
    "multipleSelectElements": [],
    "elements": [
        {
            "ignoreBaseField": true,
            "isGrouped": false,
            "id": "code",
            "type": "text",
            "className": "java.lang.String",
            "lableName": " Product   Code",
            "jsonList": null,
            "optionItemName": null,
            "optionValueName": null,
            "entityReferenceName": null,
            "entityReferenceClass": null,
            "detailFields": null,
            "inputGroupname": null,
            "previewLink": null,
            "defaultValues": null,
            "plainListValues": null,
            "options": null,
            "identity": false,
            "required": true,
            "idField": false,
            "skipBaseField": false,
            "hasJoinColumn": false,
            "multiple": false,
            "showDetail": false,
            "detailField": false,
            "multipleSelect": false,
            "hasPreview": false,
            "additionalMap": {},
            "grouped": false
        },
        {
            "ignoreBaseField": true,
            "isGrouped": false,
            "id": "name",
            "type": "text",
            "className": "java.lang.String",
            "lableName": "Name",
            "jsonList": null,
            "optionItemName": null,
            "optionValueName": null,
            "entityReferenceName": null,
            "entityReferenceClass": null,
            "detailFields": null,
            "inputGroupname": null,
            "previewLink": null,
            "defaultValues": null,
            "plainListValues": null,
            "options": null,
            "identity": false,
            "required": true,
            "idField": false,
            "skipBaseField": false,
            "hasJoinColumn": false,
            "multiple": false,
            "showDetail": false,
            "detailField": false,
            "multipleSelect": false,
            "hasPreview": false,
            "additionalMap": {},
            "grouped": false
        },
        {
            "ignoreBaseField": true,
            "isGrouped": false,
            "id": "description",
            "type": "text",
            "className": "java.lang.String",
            "lableName": "Description",
            "jsonList": null,
            "optionItemName": null,
            "optionValueName": null,
            "entityReferenceName": null,
            "entityReferenceClass": null,
            "detailFields": null,
            "inputGroupname": null,
            "previewLink": null,
            "defaultValues": null,
            "plainListValues": null,
            "options": null,
            "identity": false,
            "required": true,
            "idField": false,
            "skipBaseField": false,
            "hasJoinColumn": false,
            "multiple": false,
            "showDetail": false,
            "detailField": false,
            "multipleSelect": false,
            "hasPreview": false,
            "additionalMap": {},
            "grouped": false
        },
        {
            "ignoreBaseField": true,
            "isGrouped": false,
            "id": "price",
            "type": "number",
            "className": "long",
            "lableName": "Price",
            "jsonList": null,
            "optionItemName": null,
            "optionValueName": null,
            "entityReferenceName": null,
            "entityReferenceClass": null,
            "detailFields": null,
            "inputGroupname": null,
            "previewLink": null,
            "defaultValues": null,
            "plainListValues": null,
            "options": null,
            "identity": false,
            "required": true,
            "idField": false,
            "skipBaseField": false,
            "hasJoinColumn": false,
            "multiple": false,
            "showDetail": false,
            "detailField": false,
            "multipleSelect": false,
            "hasPreview": false,
            "additionalMap": {},
            "grouped": false
        },
        {
            "ignoreBaseField": true,
            "isGrouped": false,
            "id": "type",
            "type": "text",
            "className": "java.lang.String",
            "lableName": "Type",
            "jsonList": null,
            "optionItemName": null,
            "optionValueName": null,
            "entityReferenceName": null,
            "entityReferenceClass": null,
            "detailFields": null,
            "inputGroupname": null,
            "previewLink": null,
            "defaultValues": null,
            "plainListValues": null,
            "options": null,
            "identity": false,
            "required": true,
            "idField": false,
            "skipBaseField": false,
            "hasJoinColumn": false,
            "multiple": false,
            "showDetail": false,
            "detailField": false,
            "multipleSelect": false,
            "hasPreview": false,
            "additionalMap": {},
            "grouped": false
        },
        {
            "ignoreBaseField": true,
            "isGrouped": false,
            "id": "imageUrl",
            "type": "img",
            "className": "java.lang.String",
            "lableName": "Image Url",
            "jsonList": null,
            "optionItemName": null,
            "optionValueName": null,
            "entityReferenceName": null,
            "entityReferenceClass": null,
            "detailFields": null,
            "inputGroupname": null,
            "previewLink": null,
            "defaultValues": null,
            "plainListValues": null,
            "options": null,
            "identity": false,
            "required": false,
            "idField": false,
            "skipBaseField": false,
            "hasJoinColumn": false,
            "multiple": true,
            "showDetail": false,
            "detailField": false,
            "multipleSelect": false,
            "hasPreview": false,
            "additionalMap": {},
            "grouped": false
        },
        {
            "ignoreBaseField": true,
            "isGrouped": false,
            "id": "unit",
            "type": "dynamiclist",
            "className": "com.fajar.shoppingmart.entity.Unit",
            "lableName": "Unit",
            "jsonList": null,
            "optionItemName": "name",
            "optionValueName": "id",
            "entityReferenceName": null,
            "entityReferenceClass": "Unit",
            "detailFields": null,
            "inputGroupname": null,
            "previewLink": null,
            "defaultValues": null,
            "plainListValues": null,
            "options": null,
            "identity": false,
            "required": true,
            "idField": false,
            "skipBaseField": false,
            "hasJoinColumn": true,
            "multiple": false,
            "showDetail": false,
            "detailField": false,
            "multipleSelect": false,
            "hasPreview": false,
            "additionalMap": {},
            "grouped": false
        },
        {
            "ignoreBaseField": true,
            "isGrouped": false,
            "id": "category",
            "type": "dynamiclist",
            "className": "com.fajar.shoppingmart.entity.Category",
            "lableName": "Category",
            "jsonList": null,
            "optionItemName": "name",
            "optionValueName": "id",
            "entityReferenceName": null,
            "entityReferenceClass": "Category",
            "detailFields": null,
            "inputGroupname": null,
            "previewLink": null,
            "defaultValues": null,
            "plainListValues": null,
            "options": null,
            "identity": false,
            "required": true,
            "idField": false,
            "skipBaseField": false,
            "hasJoinColumn": true,
            "multiple": false,
            "showDetail": false,
            "detailField": false,
            "multipleSelect": false,
            "hasPreview": false,
            "additionalMap": {},
            "grouped": false
        },
        {
            "ignoreBaseField": true,
            "isGrouped": false,
            "id": "id",
            "type": "number",
            "className": "java.lang.Long",
            "lableName": "Id",
            "jsonList": null,
            "optionItemName": null,
            "optionValueName": null,
            "entityReferenceName": null,
            "entityReferenceClass": null,
            "detailFields": null,
            "inputGroupname": null,
            "previewLink": null,
            "defaultValues": null,
            "plainListValues": null,
            "options": null,
            "identity": true,
            "required": true,
            "idField": true,
            "skipBaseField": false,
            "hasJoinColumn": false,
            "multiple": false,
            "showDetail": false,
            "detailField": false,
            "multipleSelect": false,
            "hasPreview": false,
            "additionalMap": {},
            "grouped": false
        }
    ],
    "fieldNameList": [
        "code",
        "name",
        "description",
        "price",
        "type",
        "imageUrl",
        "unit",
        "category",
        "id"
    ],
    "ignoreBaseField": true,
    "gridTemplateColumns": "auto ",
    "questionare": false
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

export const transactionConfig = {
    title: "Transaction",
    entityName: "transaction",
    disabled:true,
    id: "id",
    fieldNames: [
        { name: "code" }, { name: "transactionDate", type:"longDate" },
        { name: "type" }, { name: "supplier.name" },
        { name: "customer.name" }
    ],
    formData: [
        {
            lableName: "Transaction Code",
            inputType: "text",
            name: "code"
        },
        {
            lableName: "Date",
            inputType: "text",
            name: "transactionDate"
        },
        {
            lableName: "Transaction Type",
            inputType: "text",
            name: "type"
        },
        {
            lableName: "Supplier",
            inputType: "text",
            name: "supplier.name"
        },
        {
            lableName: "Customer",
            inputType: "text",
            name: "customer.name", 
        },
         
    ]
}