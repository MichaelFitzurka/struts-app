//Grab current url

function getURL(){
var docDomain = document.domain;
var url= window.location.href;
var appname = url.split("/");

        if(appname[3]=="aad" || appname[3]=="otc"|| appname[3]=="fact"|| appname[3]=="canadaotc")
        {
               var prefUrl = "/" + appname[3] + "/tealeaf/TealeafTarget.jsp";
        }else if ((appname[3]=='consumer') && (appname[4]=='uk')){
                var prefUrl = "/" + appname[3] +"/"+ appname[4]+"/tealeaf/TealeafTarget.jsp";
        }
        else
        {
               var prefUrl = "/tealeaf/TealeafTarget.jsp";
        }


return prefUrl;
}
var tlurl = getURL();
var tlsecureurl = getURL();