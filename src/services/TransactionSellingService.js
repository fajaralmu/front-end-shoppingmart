import * as url from '../constant/Url'
import { commonAuthorizedHeader } from './../middlewares/Common';
export default class TransactionSellingService {
    static instance = TransactionSellingService.instance || new TransactionSellingService();

    getCustomerList = (raw) => {
         
        const fieldsFilter = {};
        fieldsFilter[raw.key] = raw.value;
        const request = {
            entity: "customer",
            filter: {
                page: (raw.page > 0 ? raw.page : 0),
                limit: (raw.limit > 0 ? raw.limit : 10),
                exacts: (raw.exacts == true),
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
                    if (response.code == "00") {
                        resolve(response);
                    } else {
                        reject(response)
                    }
                }).
                catch((e) => reject(e));
        })
    }

}