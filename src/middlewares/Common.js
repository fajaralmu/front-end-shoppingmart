
export const commonAuthorizedHeader = () => {
    return {
        'Content-Type': 'application/json', 
        'requestId':  '1234',//'localStorage.getItem("requestId")',
        'loginKey': localStorage.getItem('loginKey')
    }
};