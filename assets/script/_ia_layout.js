/* layout.html only 사용 : 퍼블리싱 파일 데모 용도.
실제 개발시 불필요 스크립트 */
$(window).load(function(){              
    /* page load */
    var getId = getParam("uiId");
    var getDir = getParam("uiDir");
    var getTitle = getParam("uiTitle");
    var pageTitle = decodeURI(decodeURIComponent(getTitle));            
    function getParam(name)
    {
        var curr_url = location.search.substr(location.search.indexOf("?") + 1);
        var svalue = "";
        curr_url = curr_url.split("&");
        for (var i = 0; i < curr_url.length; i++)
        {
            temp = curr_url[i].split("=");
            if ([temp[0]] == name) { svalue = temp[1]; }
        }
        return svalue;
    }            
    //console.log("getTitle: " + getTitle);
    console.log("getDir: " + getDir);
    console.log("getId : " + getId);
    console.log("pageTitle : " + pageTitle);
    contentFile = '../' + getDir + '/' + getId + '.html';
    console.log(contentFile);
    $('#headTitle').text(pageTitle);
    $('.title-content').text(pageTitle);
    if(getId == 'main'){                  
        $('#container').load(contentFile); 
    }else if(getDir == 'sub') {
        $('#container').load(contentFile);
    }else{
        $('#contentBody').load(contentFile);   
    }
}); 
