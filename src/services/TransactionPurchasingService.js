import * as url from '../constant/Url'
import { commonAuthorizedHeader } from './../middlewares/Common';
export default class TransactionPurchasingService {
    static instance = TransactionPurchasingService.instance || new  TransactionPurchasingService();

    getProductList = (raw) => {
        
        const fieldsFilter = {};
        fieldsFilter[raw.key] = raw.value;
        const request = {
            entity: "product", 
            filter: { 
                page: 0, 
                exacts: (raw.exacts == true), 
                limit: 10, 
                fieldsFilter: fieldsFilter 
            }
        }
        const endpoint = url.contextPath().concat("api/entity/get")
        return new Promise(function (resolve, reject) {
            fetch(endpoint, {
                method: url.POST,
                headers: commonAuthorizedHeader(),
                body: JSON.stringify(request),
            })
                .then(response => response.json()).then(function (response) {
                    if (response.code == "00") 
                    { resolve(response) } 
                    else 
                    { reject(response) }
                }).
                catch((e) => reject(e));
        })
    }

}