

export const menus = [
  {
    code:"home",
    name:"Home",
    url:"/home",
    menuClass: "fa fa-home",
    active: false,
    authenticated: false
  } ,
  {
    code:"catalog",
    name:"Catalog",
    url:"/catalog",
    menuClass: "fa fa-store-alt",
    active: false,
     authenticated: false
  } ,
  {
    code:"about",
    name:"About",
    url:"/about",
    menuClass: "fa fa-address-book",
    active: false,
    authenticated: false
  } ,
  {
    code:"supplierlist",
    name:"Our Supplier",
    url:"/suppliers",
    menuClass: "fas fa-warehouse",
    active: false,
    authenticated: false
  }, 
  {
    code:"chatroom",
    name:"Chat Room",
    url:"/chatroom",
    menuClass: "fas fa-comments",
    active: false,
    authenticated: false
  } ,
  {
    code:"cart",
    name:"My Cart",
    url:"/cart",
    menuClass: "fa fa-shopping-cart",
    active: false,
    authenticated: false
  } ,
  {
    code:"login",
    name:"Login",
    url:"/login",
    menuClass: "fas fa-sign-in-alt",
    active: false,
    authenticated: false
  }, 
  {
    code:"dashboard",
    name:"Dashboard",
    url:"/dashboard",
    menuClass: "fas fa-tachometer-alt",
    active: false,
    authenticated: true
  }, 
  {
    code:"management",
    name:"Management",
    url:"/management",
    menuClass: "fa fa-database",
    active: false,
    authenticated: true
  }, 
  {
    code:"selling",
    name:"Transaction Selling",
    url:"/transaction/selling",
    menuClass: "fa fa-database",
    active: false,
    authenticated: true
  }, 
  {
    code:"purchasing",
    name:"Transaction Purchasing",
    url:"/transaction/purchasing",
    menuClass: "fa fa-database",
    active: false,
    authenticated: true
  }, 
  {
    code:"logout",
    name:"Logout",
    url:"#",
    menuClass: "fas fa-sign-out-alt",
    active: false,
    authenticated: true
  }
];
