
export const commonAuthorizedHeader = () => {
    return {
        'Content-Type': 'application/json', 
        'requestId':  getRequestId(),//'localStorage.getItem("requestId")',
        'loginKey': localStorage.getItem('loginKey')
    }
};

export const getRequestId = () => {
    return localStorage.getItem("requestId");// document.getElementById("requestId").value;
}