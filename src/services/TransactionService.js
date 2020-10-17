import * as url from '../constant/Url'
import { commonAuthorizedHeader } from './../middlewares/Common';
export default class TransactionService {
    static instance = TransactionService.instance || new TransactionService()

    getTransactionData = function(transactionCode){
       const endpoint = url.contextPath().concat("api/transaction/transactiondata/"+transactionCode)
        return new Promise(function(resolve,reject){
            fetch(endpoint, {
                method: 'post',
                headers: commonAuthorizedHeader()
            })
            .then(response => response.json()).then(function(response){
                if(response.code=="00"){
                    resolve(response);
                }else{
                    reject(response)
                }
               
            }).catch((e)=>reject(e));
        })
       
    }
}