var digitalData = {"pageInstanceID":"/personal/","page":{"pageInfo":{"pageID":"/personal/","pageName":null,"searchTerm":null,"searchResult":0,"destinationURL":"https://www.equifax.com/personal/","referringURL":"http://shop.equifax.com/orderfunnel/tag-management/data-layer.js","sysEnv":"Personal computer","variant":"Chrome","version":"59","breadcrumbs":null,"author":"Equifax","issueDate":1512144941627,"effectiveDate":1512144941627,"expiryDate":1512144941627,"language":"en_US","geoRegion":"US","industryCodes":"SIC-7320","publisher":"Equifax"},"category":null,"attributes":{"efxSessionID":"B7169C40FA0BE637735B849C1F03C3A3","efxExperienceID":"08A1E6E2-9E36-48B6-A341-30722B73865D","server":"aptp1lc9a091.app.c9.equifax.com"}},"product":null,"cart":null,"transaction":null,"event":[{"eventInfo":{"eventName":null,"eventAction":"pageLoad","eventPoints":0,"type":"pageLoad","timeStamp":1512144846583,"effect":null},"category":{"primaryCategory":"RENDER","secondaryCategory":null,"tertiaryCategory":null},"attributes":null}],"component":null,"user":null,"privacy":null,"version":"1.0.0"};
try {
	digitalData.page.pageInfo.referringURL=document.referrer;
	digitalData.page.attributes.supportCookies=navigator.cookieEnabled;
	digitalData.page.attributes.supportJavascript=true;
} catch(ex) {}


try {
	
	$(function() {		
		digitalData.page.attributes.screenWidth=$(window).width();
		digitalData.page.attributes.screenHeight=$(window).height();
		digitalData.page.attributes.browserWidth=$(document).width() || $(window).width();
		digitalData.page.attributes.browserHeight=$(document).height() || $(window).height();		
	});		
		
} catch(ex) {}

