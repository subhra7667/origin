<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <title>Run your Request</title>


    <link href="<c:url value="/resources/css/jquery-ui.min.css" />" rel="stylesheet">
    <script src="<c:url value="/resources/js/jquery-3.1.1.min.js" />"></script>
    <script src="<c:url value="/resources/js/jquery-ui.min.js" />"></script>

    <script type="text/javascript" src="<c:url value="/resources/js/project.js" />"></script>
    <link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/project.css"/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/common.css"/>"/>
    <script>

        /* jQuery(document).ready(function(){
         jQuery('#settings').on('click', function(event) {
         jQuery('.content').toggle('show');
         });
         }); */


    </script>
</head>
<body>
<div class="container">
    <%@ include file="header.jsp" %>
    <div class="centerBody">
        <div class="topMenu">
            <a href="#" id="project" class="tiles" onclick="showManageProjectPanel();">
                <i class="fa fa-folder-open" aria-hidden="true"></i>
                <h3 class="tileTag">Project Data</h3></a>
            <a href="#" id="task" class="tiles" onclick="showManageTaskPanel();">
                <i class="fa fa-list-ul" aria-hidden="true"></i>
                <h3 class="tileTag">Task Data</h3></a>
                
                
                <a href="#" id="pgmt" class="tiles" onclick="showProjectMgmt();">
                <i class="fa fa-list-ul" aria-hidden="true"></i>
                <h3 class="tileTag">Project Management Tool</h3></a>
                
                
            <a href="#" id="bug" class="tiles" onclick="showManageBugsPanel();">
                <i class="fa fa-ban" aria-hidden="true"></i>
                <h3 class="tileTag">Defects Data</h3></a>
        </div>
        <c:if test="${user.role.ordinal() == 0 || user.role.ordinal() == 1}">
        <div class="botMenu">
            <a href="#" id="resource" class="tiles" onclick="showManageResourcePanel();">
                <i class="fa fa-users" aria-hidden="true"></i>
                <h3 class="tileTag">Resource Data</h3></a>
            <a href="#" id="env" class="tiles" onclick="showManageEnvPanel();">
                <i class="fa fa-connectdevelop" aria-hidden="true"></i>
                <h3 class="tileTag">Environment Data</h3></a>
            <a href="#" id="instance" class="tiles" onclick="showManageInstancePanel();">
                <i class="fa fa-server" aria-hidden="true"></i>
                <h3 class="tileTag">Instance Data</h3></a>
        </div>
        </c:if>
        <div class="rightBody" id="showTablePanle">
            <button type="button" onclick="document.getElementById('showTablePanle').style.display='none'"
                    class="close">×
            </button>
            <div class="topTableContent"></div>
            <div class="assainBody"></div>
        </div>
    </div>
    <%@ include file="footer.jsp" %>
</div>

</body>
</html>
