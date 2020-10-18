
const devMode = document.getElementById("rootPath").value == "${contextPath}";
const rootValue = devMode ?
     "/universal-good-shop/" : document.getElementById("rootPath").value+"/";

export const contextPath = function(){
    return devMode? "http://localhost:8080".concat(rootValue):rootValue;
}
 
export const baseImageUrl = contextPath()+"WebAsset/Shop1/Images/";
export const baseResUrl = contextPath()+"res/img/";

export const POST = "post";
