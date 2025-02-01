/**
 * @author Nirupam, Salma
 * @version 1.1
 * Last Modified by Nirupam on 2017-05-22
 *
 */

var projectid = [];
var proID = [];
var resourceid = [];
var envID = [];
var rsrc_names = [];

function showManageProjectPanel() {

    var div = $("<div></div>");
    var head = $("<h3 class='titleHead'>Project Management</h3>").appendTo(div);
    var status = $("<p id='status'></p>").appendTo(div);
    var table = $("<table id=DynamicPjt class=dynoTable border=1></table>").appendTo(div);
    table.append("<tr>"/* + "<th>Created-By</th>"*/
            /*+ "<th>Project-ID</th>"*/
        + "<th>Project-Name</th>"
        + "<th>Description</th>"
        + "<th>Creation-Date</th>"
        + "<th>Start-Date</th>"
        + "<th>End-Date</th>"
        + "<th>Updated-Date</th>"
        + "<th>Delete</th>"
        + "<th>Update</th>"
        + "<th>Assign</th>" + "</tr>");

    $.get("./project/list", function (data, status) {
        data = JSON.parse(JSON.stringify(data));
        $.each(data, function (k, v) {

            var sd = new Date();
            sd.setTime(v.start_date);
            sd = sd.getDate() + "-" + (sd.getMonth() + 1) + "-" + sd.getFullYear();
            var ed = new Date();
            ed.setTime(v.end_date);
            ed = ed.getDate() + "-" + (ed.getMonth() + 1) + "-" + ed.getFullYear();

            var pjtData = "<tr>"
                + "<td>" + v.project_name + "</td>"
                + "<td>" + v.project_details + "</td>"
                + "<td>" + v.creation_date + "</td>"
                + "<td>" + sd + "</td>"
                + "<td>" + ed + "</td>"
                + "<td>" + v.updated_date + "</td>"
                + "<td><a href='#' onClick='deletePjt(" + "\"" + v.project_id + "\"" + ")'>Delete</a></td>"
                + "<td><a href='#' onClick='updateProjectModal(" + "\"" + v.project_id + "\"" + ','
                + "\"" + v.project_name + "\"" + ','
                + "\"" + v.project_details + "\"" + ");'>Update</a></td>"
                + "<td><a href='#' onClick='assignProject(" + "\"" + v.project_id + "\"" + ");'>Assign</a></td>"
                + "</tr>";
            $(table).append(pjtData)
        });
        $(".topTableContent").html(div);
    });

    var button = $("<input type='button' class='button' id='button' value='Create Project' onclick='showCreateProjectPanel()' />").appendTo(div);
    $(".rightBody").css("display", "block");


    $(".assainBody").hide();

}

function showCreateProjectPanel() {
    /*"<span id='status'></span>"
     + "<br/>" + */
    var html = "<p class='updateHead'>Create Project</p>"
        + "<label>Project Name</label>"
        + "<input type='text' id='pjt_name' />"
        + "<br />"
        + "<label>Start-Date</label>"
        + "<input type='text' id='pjt_SD' readonly />"
        + "<br />"
        + "<label>End-Date</label>"
        + "<input type='text' id='pjt_ED' readonly />"
        + "<br />"
        + "<label>Project Description</label>"
        + "<textarea rows='4' cols='50' id='pjt_des'></textarea>"
        + "<br />"
        + "<input type='button' class='button'  id='botButton' value='Add Project' onclick='createProject()' />"
        + "<br />" + "<br />"

    $(".assainBody").html(html);
    $(".assainBody").show();
    $("#pjt_SD").datepicker({dateFormat: 'dd-mm-yy'});
    $("#pjt_ED").datepicker({dateFormat: 'dd-mm-yy'});
}

function createProject() {
    if (($("#pjt_name").val() == "") || ($("#pjt_des").val() == "")
        || ($("#pjt_SD").val() == "") || ($("#pjt_ED").val() == ""))
        alert("Please enter the details proceed further");
    else {
        $.post("./project/add", {
            project_name: $("#pjt_name").val(),
            project_des: $("#pjt_des").val(),
            project_SD: $("#pjt_SD").val(),
            project_ED: $("#pjt_ED").val(),
        }, function (data, status) {
            data = JSON.stringify(data);
            data = JSON.parse(data);
            if (data.success)
                $("#status").html(data.msg);
            showManageProjectPanel();
        });
    }
}
function updateProjectModal(prjtid, prjtname, prjtdes) {
    var html = "<p class='updateHead'>Edit Project Details</p>"
        + "<input type='hidden' id='pjtid' value='" + prjtid + "'/>"
        + "<label>Project Name</label>"
        + "<input type='text' id='newPjtname' value='" + prjtname + "'/>"
        + "<br/>"
        + "<label>Project Details</label>"
        + "<textarea rows='4' cols='45' id='newPjtDes'>" + prjtdes + "</textarea>"
        + "<br />"
        + "<input type='button' class='button'  id='botButton' value='Update' onclick='updateProject()' />"
        + "<br/>" + "<br/>"

    $(".assainBody").html(html);
    $(".assainBody").show();
}

function updateProject() {
    $.post("./project/update", {
        project_id: $("#pjtid").val(),
        project_name: $("#newPjtname").val(),
        project_details: $("#newPjtDes").val(),
    }, function (data, status) {
        data = JSON.parse(JSON.stringify(data));
        //if (data.success)
        $("#status").html(data.success);
        showManageProjectPanel();
    });
}

function assignProject(pID) {
    var html = "<p class='updateHead'>Assign Project</p>"
        + "<label>Resource Name</label>"
        + "<select id='resource_name' multiple></select>" + "<br />"
        + "<label>Comments</label>"
        + "<textarea rows='4' cols='50' id='pr_comments'></textarea>"
        + "<br />"
        + "<input type='button' class='button' id='button' value='Assign Project' onclick='assignRsrcProject(\"" + pID + "\")' />"
        + "<br />" + "<br />";

    $(".assainBody").html(html);
    $(".assainBody").show();

    var resource_roles = ["DEVELOPER", "INFRA_USER", "DEPLOYER", "TEST_MANAGER", "RELEASE_MANAGER"];
    $.post("./resource/listByRoles", {
        role: resource_roles
    }, function (data, status) {
        $("#resource_name").html("");
        data = JSON.parse(JSON.stringify(data));

        $.each(data, function (k, v) {
            $("#resource_name").append('<option value=' + v.resource_id + '>' + v.resource_name + '</option>');
        });
        
    });
}

function assignRsrcProject(pID) {
    $.post("./project/assign", {
        resource_ids: $("#resource_name").val(),
        //comments: $("#pr_comments").val(),
        project_id: pID,
    }, function (data, status) {
        data = JSON.parse(JSON.stringify(data));
        if (data.success)
            $("#status").html(data.msg);
        showManageProjectPanel();
    });
}

function deletePjt(val) {
    $.post("./project/delete", {
        project_id: val
    }, function (data, status) {
        console.log("Deleted " + val);
        if (data.success)
            $("#status").html(data.success);
        showManageProjectPanel();
    });
}




//Project Management Tool
showManageProjectMgmtPanel()

//TASK Management
function showManageTaskPanel() {
    var div = $("<div></div>");
    var head = $("<h3 class='titleHead'>Task Management</h3><div style='position:absolute;left:30%;'><input type='text' id='searchTaskTxt' placeholder='Enter CR no to filter'/><input type='button' value='Search' onclick='searchTask()'/></div><br/><div class='page'></div>").appendTo(div);
    var status = $("<p id='status'></p>").appendTo(div);
    var table = $("<table id=DynamicTsk class=dynoTable border=1></table>").appendTo(div);
    table.append("<thead><tr>" + "<th style='display:none;'>Task-ID</th>"
        + "<th>Project-Name</th>"
        + "<th>Task-Name</th>"
        + "<th>Task-Type</th>"
        + "<th>Change Request No</th>"
        + "<th>Description</th>"
        + "<th>Assigned-To</th>"
        + "<th>Comments</th>"
        + "<th>Status</th>"
        + "<th>Priority</th>"
        + "<th>Created By</th>"
        + "<th>Creation-Date</th>"
        + "<th>Expected-Start-Date</th>"
        + "<th>Expected-End-Date</th>"
        + "<th>Actual-Start-Date</th>"
        + "<th>Actual-End-Date</th>"
        + "<th>Updated-Date</th>"
        + "<th>Report</th>"
        + "<th>Delete Task</th>"
        + "<th>Update Task</th>"
        + "<th>Assign Task</th>" + "</tr></thead><tbody id='taskTblBody'></tbody>");

    $(".topTableContent").html(div);
    
    $.get("./task/list", function (data, status) {
    	data = JSON.parse(JSON.stringify(data));
    	data = Array.from(data.reduce((m, t) => m.set(t.task_id, t), new Map()).values());

        all_tasks = JSON.parse(JSON.stringify(data));
        task_data = all_tasks;

        var page_count = task_data.length/5;
        var page_html = "<a href='#' onClick ='getPageNoForTaskOnPrevNext(\"prev\")'>&laquo;</a>";
        for(var p = 0; p < page_count && page_count < 15; p++) {
      	    page_html += "<a href='#' onClick ='showLimitedTaskRows("+ (p+1) + ")'>" + (p+1) + "</a>";
        }
	  		  //+ "<a href='#' onClick ='showLimitedRows('6')'>&raquo;</a>"
        page_html += "<a href='#' onClick ='getPageNoForTaskOnPrevNext(\"next\")'>&raquo;</a>";
        
        $(page_html).appendTo(".page");
        
        showLimitedTaskRows(1);
    });

    $("<input type='button' class='button'  id='button' value='Create Task' onclick='showCreateTaskPanel()'/>").appendTo(div);
    $(".rightBody").css("display", "block");

    $(".assainBody").hide();
}

function getPageNoForTaskOnPrevNext(x) {
	var pageNo = -1;
	var last_task_page = parseInt(localStorage.getItem("last_task_page"));
	var max_pages_possibile = task_data.length/5;
	
	if(x === "prev")
		pageNo = last_task_page - 1;
	else if(x === "next")
		pageNo = last_task_page + 1;
	
	if(pageNo < 1 || pageNo > max_pages_possibile)
		alert("No more pages");
	else
		showLimitedTaskRows(pageNo);
}

function showLimitedTaskRows(pageNo) {
	console.log(pageNo);
    $("#taskTblBody").html("");
	localStorage.setItem("last_task_page", pageNo);
	
	for(var i = (pageNo-1)*5; i <= pageNo*5-1 && i < task_data.length; i++) {
        var v = task_data[i];
        var asd;
        var aed;
        if (v.actual_start_date == "No Updates") {
            asd = "No Updates"
        }
        else {
            asd = new Date();
            asd.setTime(v.actual_start_date);
            asd = asd.getDate() + "-" + (asd.getMonth() + 1) + "-" + asd.getFullYear();
        }
        if (v.actual_end_date == "No Updates") {
            aed = "No Updates";
        }
        else {
            aed = new Date();
            aed.setTime(v.actual_end_date);
            aed = aed.getDate() + "-" + (aed.getMonth() + 1) + "-" + aed.getFullYear();
        }

        var esd = new Date();
        esd.setTime(v.expected_start_date);
        esd = esd.getDate() + "-" + (esd.getMonth() + 1) + "-" + esd.getFullYear();
        var eed = new Date();
        eed.setTime(v.expected_end_date);
        eed = eed.getDate() + "-" + (eed.getMonth() + 1) + "-" + eed.getFullYear();

        var taskData = "<tr>"
            + "<td>" + v.project_name + "</td>"
            + "<td>" + v.task_name + "</td>"
            + "<td>" + v.taskType + "</td>"
            + "<td>" + v.changeReqNo + "</td>"
            + "<td>" + v.task_des + "</td>"
            + "<td>" + v.assigne + "</td>"
            + "<td>" + v.assigne_cmnt + "</td>"
            + "<td>" + v.status + "</td>"
            + "<td>" + v.priority + "</td>"
            + "<td>" + v.created_by + "</td>"
            + "<td>" + v.creation_date + "</td>"
            + "<td>" + esd + "</td>"
            + "<td>" + eed + "</td>"
            + "<td>" + asd + "</td>"
            + "<td>" + aed + "</td>"
            + "<td>" + v.updated_date + "</td>"
            + "<td><a href='./task/downloadReport?task_id=" + v.task_id + "&reportName=" + v.reportName + "&mimeType=" + v.mimeType + "' target='_blank'>Report</a></td>"
            + "<td><a href='#' onClick='deleteTsk(" + "\"" + v.task_id + "\"" + ");'>Delete</a></td>"
            + "<td><a href='#' onClick='updateTaskModal(" + i + ");'>Update</a>" + "</td>"
            + "<td><a href='#' onClick='assignTsk(" + "\"" + v.task_id + "\"" + ","
            + "\"" + v.task_name + "\"" + ");'>Assign</a></td>" + "</tr>";

        $("#taskTblBody").append(taskData)
    }
    
	//$(".topTableContent").html(div);
}

function searchTask() {
    var srchTxt = $("#searchTaskTxt").val().toLowerCase();

    if(srchTxt.length < 3) {
        alert("At least 3 characters required for search");
        return;
    }

    task_data = all_tasks.filter(function (t) {
        return t.changeReqNo.toLowerCase().indexOf(srchTxt) > -1;
    });

    var page_count = task_data.length/5;
    var page_html = "<a href='#' onClick ='getPageNoForTaskOnPrevNext(\"prev\")'>&laquo;</a>";
    for(var p = 0; p < page_count && page_count < 15; p++) {
        page_html += "<a href='#' onClick ='showLimitedTaskRows("+ (p+1) + ")'>" + (p+1) + "</a>";
    }
    page_html += "<a href='#' onClick ='getPageNoForTaskOnPrevNext(\"next\")'>&raquo;</a></div>";

    $(".page").html(page_html);

    showLimitedTaskRows(1);
}

$(function() {
	$(".hideInput").hide();
	});

var task_type;
function showCreateTaskPanel() {
	
    var html = "<p class='updateHead'>Create Task</p>"
        + "<label>Project ID</label>"
        + "<select id='projectID' onchange='getProjectName()'></select>"
        + "<input type='button' class='button' style='margin-left:7px;margin-bottom:3px;padding-top:3px' value='Load ID' onclick='loadPjt_ID()' />"
        + "<br />"
        + "<label>Project Name</label>"
        + "<input type='text' id='projectName' readonly />"
        + "<br />"
        + "<label>Task Name</label>"
        + "<input type='text' id='task_name' />"
        + "<br />"
        + "<label>Task Type</label>"
        + "<select id='task_type'  onchange='showOnTaskType()'>"
        + "<option value=''>Select</option>"
        + "<option value='Project'>Project</option>"
        + "<option value='Change Request'>Change Request</option>"
        + "<option value='create_task_type'>Create Task Type</option>"
        + "</select>" + "<br/>"
        + "<label class='hideInput' id='tt_label_val'></label>"
        + "<input type='text' class='hideInput' id='tt_input_val'/>"
        + "<span class='hideInput' id='tt_span_val'><br/></span>"
        + "<label>Change Request No</label>"
        + "<input type='radio' name='chrq_generate' disabled value='MANUAL' onchange='showCRNoGenerationType()' />Manual"
        + "<input type='radio' name='chrq_generate' checked disabled value='AUTO' onchange='showCRNoGenerationType()' />Automatic<br />"
        + "<label> </label>"
        + "<input type='checkbox' id='isDepStage' checked disabled />"
        + "<select id='depStage'>"
		+ "<option value='DEV'>DEV</option>"
        + "<option value='ST'>ST</option>"
        + "<option value='SIT'>SIT</option>"
        + "<option value='PT'>SPT</option>"
        + "<option value='GOLD'>GOLD</option>"
        + "<option value='E2ESIT'>E2ESIT</option>"
        + "<option value='TRN'>Training</option>"
        + "<option value='UAT'>UAT</option>"
        + "<option value='PREPROD'>PREPROD</option>"
        + "<option value='PROD'>PROD</option>"
        + "</select>"
        + "<input type='checkbox' id='isTechnology' checked disabled />"
        + "<select id='technology'>"
        + "<option value='SOA'>SOA</option>"
        + "<option value='OSB'>OSB</option>"
        + "<option value='CCB'>CCB</option>"
        + "<option value='MDM'>MDM</option>"
        + "<option value='DSS'>DSS</option>"
        + "<option value='UCM'>UCM</option>"
        + "<option value='DOCUMAKER'>DOCUMAKER</option>"
        + "<option value='OUA'>OUA</option>"
        + "<option value='SALESCLOUD'>SALESCLOUD</option>"
        + "<option value='SERVICECLOUD'>SERVICECLOUD</option>"
        + "<option value='CPQ'>CPQ</option>"
        + "<option value='MARKETING'>MARKETING</option>"
        + "<option value='SALESTPI'>SALES-TPI</option>"
        + "</select>"
        + "<input type='checkbox' id='isChrqDate' checked disabled /> <span id='isChrqDateLbl'> Date<br/> <label> </label> </span>"
        + "<input type='hidden' id='chrqDate' readonly/>"
        + "<input type='text' id='req_num'/>"
        + "<br />"
        + "<label>Defect No</label>"
		+ "<input type='text' id='defect_num' />"
		+ "<br />"
        + "<label>Status</label>"
        + "<select id='task_status'>"
        + "<option value=''>Select</option>"
        + "<option value='Not Assigned'>Not Assigned</option>"
        + "<option value='Assigned'>Assigned</option>"
        + "<option value='Work In Progress'>Work In Progress</option>"
        + "<option value='Pending with Admin team'>Pending with Admin team</option>"
        + "<option value='Pending with Development team'>Pending with Development team</option>"
        + "<option value='Pending with Testing team'>Pending with Testing team</option>"
        + "<option value='Pending with Approval team'>Pending with Approval team</option>"
        + "<option value='Failed'>Failed</option>"
        + "<option value='Completed'>Completed</option>"
        + "</select>" + "<br />"
        + "<label>Priority</label>"
        + "<select id='priority'>"
        + "<option value=''>Select</option>"
        + "<option value='p1'>P1</option>"
        + "<option value='p2'>P2</option>"
        + "<option value='p3'>P3</option>"
        + "</select>" + "<br />"
        + "<label>Expected Start-Date</label>"
        + "<input type='text' id='task_ESD' readonly />"
        + "<br />"
        + "<label>Expected End-Date</label>"
        + "<input type='text' id='task_EED' readonly />"
        + "<br />"
        + "<label>Task Description</label>"
        + "<textarea rows='4' cols='50' id='task_des'></textarea>"
        + "<br />"
        + "<label>Upload File</label>"
        + "<input  type='file' id='taskFile' class='uploadFile'/>" + "<br />" + "<br />"
        + "<input type='button' class='button' id='botButton' value='Add Task' onclick='createTask();'/>"
        + "<br/>";

    	

    $(".assainBody").html(html);
    $(".assainBody").show();
    $("#task_ESD").datepicker({dateFormat: 'dd-mm-yy'});
    $("#task_EED").datepicker({dateFormat: 'dd-mm-yy'});
    
    var currDate = new Date();
    var chrqDate =  currDate.getFullYear();
    if((currDate.getMonth() + 1) < 10)
    	chrqDate += "0" + (currDate.getMonth() + 1);
    else
    	chrqDate += "" + (currDate.getMonth() + 1);
    if (currDate.getDate() < 10)
    	chrqDate += "0" + currDate.getDate();
    else
    	chrqDate += "" + currDate.getDate();
    $("#chrqDate").val(chrqDate);
    
    /*$("#depStage").hide();
    $("#isDepStage").hide();
    $("#technology").hide();
    $("#isTechnology").hide();
    $("#chrqDate").hide();
    $("#isChrqDate").hide();
    $("#isChrqDateLbl").hide();*/
    showCRNoGenerationType();

}

function showCRNoGenerationType() {
	var x = $('input[name=chrq_generate]:checked').val();
	if(x === 'AUTO') {
		$("#depStage").show();
	    $("#technology").show();
	    $("#chrqDate").show();

        $("#isDepStage").show();
        $("#isTechnology").show();
        $("#isChrqDate").show();
        $("#isChrqDateLbl").show();

        $("#req_num").hide();
        /*$.get("./task/getAutoCR", function (data, status) {
            data = JSON.parse(JSON.stringify(data));

            $("#req_num").val(data.chrq);
        });*/

	} else {
        $("#req_num").show();

		$("#depStage").hide();
	    $("#technology").hide();
	    $("#chrqDate").hide();

        $("#isDepStage").hide();
        $("#isTechnology").hide();
        $("#isChrqDate").hide();
        $("#isChrqDateLbl").hide();
	}
}

function showOnTaskType(){
	var html;
	if($("#task_type").val()=="create_task_type"){
		$("#tt_label_val").removeClass('hideInput');
		$("#tt_span_val").removeClass('hideInput');
		$("#tt_input_val").removeClass('hideInput');
		task_type = $("#tt_input_val").val();
	}
	else{
		$("#tt_input_val").addClass('hideInput');
		$("#tt_label_val").addClass('hideInput');
		$("#tt_span_val").addClass('hideInput');
		task_type = $("#task_type").val();
	}
}

function createTask() {
	var x = $('input[name=chrq_generate]:checked').val();

	var fd = new FormData();
    fd.append("file", document.getElementById('taskFile').files[0]);
    fd.append("projectID", $("#projectID").val());
    fd.append("projectName", $("#projectName").val());
    fd.append("task_name", $("#task_name").val());
    fd.append("status", $("#task_status").val());
    fd.append("priority", $("#priority").val());
    fd.append("task_des", $("#task_des").val());
    fd.append("task_SD", $("#task_ESD").val());
    fd.append("task_ED", $("#task_EED").val());
    fd.append("task_type", task_type);
	fd.append("defect_no", $("#defect_num").val());
	if((x !== 'AUTO') && $("#req_num").val() == "" ) {
		alert("Enter CR No ");
		return;
	}
	if(x === 'AUTO') {
	    var autoCrNum = '';
	    if($("#isDepStage").is(":checked"))
            autoCrNum += $("#depStage").val() + "_";
	    if( $("#isTechnology").is(":checked"))
            autoCrNum += $("#technology").val() + "_";
	    if($("#isChrqDate").is(":checked"))
            autoCrNum += $("#chrqDate").val() + "_";

        /*fd.append("change_req_no",
            autoCrNum + $("#req_num").val());*/
    	fd.append("change_req_no", autoCrNum);

    } else
    	fd.append("change_req_no", $("#req_num").val());


    $.ajax({
        url: './task/add',
        data: fd,
        processData: false,
        contentType: false,
        enctype: 'multipart/form-data',
        type: 'POST',
        success: function (data) {
            showManageTaskPanel();
        },
        error: function (err) {
            alert(err);
        }
    });
}

function loadPjt_ID() {
    $.get("./project/list", function (data, status) {
        $("#projectID").html("");
        projectid = JSON.parse(JSON.stringify(data));

        $.each(projectid, function (k, v) {
            $("#projectID").append(
                '<option value=' + v.project_id + '>' + v.project_id + '</option>');
        });

        getProjectName();
    });
}

function getProjectName() {
    $.each(projectid, function (k, v) {
        if (v.project_id == $("#projectID").val()) {
            $("#projectName").val(v.project_name);
        }
    });
}

/*function createT() {
 if (($("#task_name").val() == "") || ($("#task_des").val() == "")
 || ($("#task_SD").val() == "") || ($("#task_ED").val() == ""))
 alert("Please enter the details proceed further");
 else {
 $.post("./task/add", {
 projectID  : $("#projectID").val(),
 projectName: $("#projectName").val(),
 task_name  : $("#task_name").val(),
 status     : $("#task_status").val(),
 priority   : $("#priority").val(),
 task_des   : $("#task_des").val(),
 task_SD    : $("#task_ESD").val(),
 task_ED    : $("#task_EED").val(),
 }, function (data, status) {
 data = JSON.parse(JSON.stringify(data));
 if (data.success)
 $("#status").html(data.msg);

 showManageTaskPanel();
 });
 }
 }
 */

function updateTaskModal(i) {
    var v = task_data[i];
    var tskid = v.task_id;
    var tskname = v.task_name;
    var status = v.status;
    var asd = v.actual_start_date;
    var aed = v.actual_end_date;
    var tskdes = v.task_des;
    var comments = v.assigne_cmnt;
    var priority = v.priority;
    var assignee = v.assigne;
    var taskType = v.taskType;
    var change_req_no = v.change_req_no;
    if (asd == "No Updates") {
        asd = "No Updates";
    }
    else {
        asd = new Date();
        asd.setTime(v.actual_start_date);
        asd = asd.getDate() + "-" + (asd.getMonth() + 1) + "-" + asd.getFullYear();
    }
    if (aed == "No Updates") {
        aed = "No Updates";
    }
    else {
        aed = new Date();
        aed.setTime(v.actual_end_date);
        aed = aed.getDate() + "-" + (aed.getMonth() + 1) + "-" + aed.getFullYear();
    }
    $.get("./resource/list", function (data, status) {
        $("#assignTaskUpdate").html("");
        resourceData = JSON.parse(JSON.stringify(data));
        $.each(resourceData, function (k, v) {
            console.log(v.resource_id + "---------------")
            $("#assignTaskUpdate").append('<option value=' + v.resource_id + '>' + v.resource_name + '</option>');
        });

    });

    var html = "<p class='updateHead'>Edit Task Details</p>"
        + "<input type='hidden' id='tId' value='" + tskid + "'/>"
        + "<label>Task Name</label>"
        + "<input type='text' id='newtskname' value='" + tskname + "'/>"
        + "<br />"
        + "<label>Status</label>"
        + "<select id='newtskstatus'>"
        + "<option value=''>Select</option>"
        + "<option value='Not Assigned'>Not Assigned</option>"
        + "<option value='Assigned'>Assigned</option>"
        + "<option value='Work In Progress'>Work In Progress</option>"
        + "<option value='Pending with Admin team'>Pending with Admin team</option>"
        + "<option value='Pending with Development team'>Pending with Development team</option>"
        + "<option value='Pending with Testing team'>Pending with Testing team</option>"
        + "<option value='Pending with Approval team'>Pending with Approval team</option>"
        + "<option value='Failed'>Failed</option>"
        + "<option value='Completed'>Completed</option>"
        + "</select>" + "<br />"
        + "<label>Priority</label>"
        + "<select id='tsk_priority'>"
        + "<option value=''>Select</option>"
        + "<option value='p1'>P1</option>"
        + "<option value='p2'>P2</option>"
        + "<option value='p3'>P3</option>"
        + "</select>" + "<br />";
        /*+ "<label>Task Type</label>"
        + "<select id='tsk_type'>"
        + "<option value=''>Select</option>"
        + "<option value=''></option>"
        + "</select>" + "<br />"
        + "<label>Task Type</label>"
        + "<input type='text' id='task_req_no' value='" + change_req_no + "'/>" + "<br />";*/
    /*if (assignee != "Not Assigned") {
        html += "<label>Resource</label>"
            + "<select id='assignTaskUpdate'></select>" + "<br />"
    }*/
    html += "<label>Start-Date</label>"
        + "<input type='text' id='newtsksd' value='" + asd + "' readonly />" + "<br />"
        + "<label>End-Date</label>"
        + "<input type='text' id='newtsked' value='" + aed + "' readonly />" + "<br />"
        + "<label>Task Details</label>"
        + "<textarea rows='4' cols='45' id='newtskDes'>" + tskdes + "</textarea>"
        + "<br />"
        + "<label>Comments</label>"
        + "<textarea rows='4' cols='45' id='newtskCom'>" + comments + "</textarea>"
        + "<br />"
        + "<label>Upload File</label>"
        + "<input  type='file' id='taskFile' class='uploadFile'/>" + "<br />" + "<br />"
        + "<input type='button' class='button'  id='botButton' value='Update' onclick='updateTsk()' />"
        + "<br />" + "<br />";

    $(".assainBody").html(html);
    $(".assainBody").show();
    $("#newtsksd").datepicker({dateFormat: 'dd-mm-yy'});
    $("#newtsked").datepicker({dateFormat: 'dd-mm-yy'});
}

function updateTsk() {
    //console.log(document.getElementById('taskFile').files[0]);
    var assignee;
    /*if ($("#assignTaskUpdate").val() == null) {
        assignee = "Not Assigned";
    }
    else {
        assignee = $("#assignTaskUpdate").val();
    }*/

    var fd = new FormData();
    fd.append("task_id", $("#tId").val());
    fd.append("task_name", $("#newtskname").val());
        fd.append("status", $("#newtskstatus").val());
    fd.append("priority", $("#tsk_priority").val());
    fd.append("start_date", $("#newtsksd").val());
    fd.append("end_date", $("#newtsked").val());
    fd.append("task_details", $("#newtskDes").val());
    fd.append("task_comments", $("#newtskCom").val());
    fd.append("file", document.getElementById('taskFile').files[0]);

    $.ajax({
        url: './task/update',
        data: fd,
        processData: false,
        contentType: false,
        enctype: 'multipart/form-data',
        type: 'POST',
        success: function (data) {
            showManageTaskPanel();
        },
        error: function (err) {
            alert(err);
        }
    });

    /*$.post("./task/update", {
        task_id: $("#tId").val(),
        task_name: $("#newtskname").val(),
        status: $("#newtskstatus").val(),
        priority: $("#tsk_priority").val(),
        start_date: $("#newtsksd").val(),
        end_date: $("#newtsked").val(),
        task_details: $("#newtskDes").val(),
        task_comments: $("#newtskCom").val(),
        file: document.getElementById('taskFile').files[0]
        /*assignee: assignee,
        task_type: $("#tsk_type").val(),
        change_req_no: $("#task_req_no").val(),*/
    /*}, function (data, status) {
        data = JSON.stringify(data);
        data = JSON.parse(data);
        if (data.success)
            $("#status").html(data.success);
        showManageTaskPanel();
    });*/
}


function assignTsk(tid, tname) {
    var tskid = tid;
    var tskname = tname;
    var html = "<p class='updateHead'>Assign Task</p>"
        + "<label>Resource</label>"
        + "<select id='rsrcid''></select>"
        + "<input type='button' class='button' style='margin-left:7px;margin-bottom:3px;padding-top:3px' value='Load ID' onclick='loadRsrcID()' />"
        + "<br />"
        /*+ "<label>Resource Name</label>"
        + "<input type='text' id='rsrcname' readonly />"
        + "<br />"*/
        + "<label>Comments</label>"
        + "<textarea rows='4' cols='50' id='comments'></textarea>"
        + "<br />"
        + "<input type='button' class='button' id='botButton' value='Assign Task' onclick='assignRsrc("
        + "\"" + tskid + "\"" + "," + "\"" + tskname + "\"" + ")' />"
        + "<br />" + "<br />"

    $(".assainBody").html(html);
    $(".assainBody").show();

}

function loadRsrcID() {
    $.get("./resource/listAll", function (data, status) {
        $("#rsrcid").html("");
        resourceid = JSON.parse(JSON.stringify(data));

        $.each(resourceid, function (k, v) {
            $("#rsrcid").append(
                '<option value=' + v.resource_id + '>' + v.resource_name
                + '</option>');
        });

        getRsrcName();
    });
}

/*function getRsrcName() {
    $.each(resourceid, function (k, v) {
        if (v.resource_id == $("#rsrcid").val()) {
            $("#rsrcname").val(v.resource_name);
        }
    });
}*/

function assignRsrc(tskid, tskname) {
    $.post("./task/assign", {
        rsrcid: $("#rsrcid").val(),
        //rsrcname: $("#rsrcname").val(),
        taskid: tskid,
        //tskname: tskname,
        comments: $("#comments").val(),
    }, function (data, status) {
        data = JSON.parse(JSON.stringify(data));
        if (data.success)
            $("#status").html(data.msg);
        showManageTaskPanel();
    });
}

function deleteTsk(tskid) {
    $.post("./task/delete", {
        task_id: tskid
    }, function (data, status) {
        console.log(" Deleted " + tskid);
        if (data.success)
            $("#status").html(data.success);
        showManageTaskPanel();
    });

}

//BUG Management
function showManageBugsPanel() {
    var div = $("<div></div>");
    var head = $("<div class='page'><h3 class='titleHead'>Defect Management</h3>").appendTo(div);
    var status = $("<p id='status'></p>").appendTo(div);
    var table = $("<table id=DynamicBug class=dynoTable border=1></table>").appendTo(div);
    table.append("<thead><tr>"
        + "<th>Project-Name</th>"
        + "<th>Bug-Name</th>"
        + "<th>File-Name</th>"
        + "<th>Description</th>"
        + "<th>Assigned-To</th>"
        + "<th>Comments</th>"
        + "<th>Status</th>"
        + "<th>Priority</th>"
        + "<th>Creation-Date</th>"
        + "<th>Expected-Start-Date</th>"
        + "<th>Expected-End-Date</th>"
        + "<th>Actual-Start-Date</th>"
        + "<th>Actual-End-Date</th>"
        + "<th>Updated-Date</th>"
        + "<th>Report</th>"
        + "<th>Delete Error</th>"
        + "<th>Update Error</th>"
        + "<th>Assign Errors</th>" + "</tr></thead><tbody id='bugTblBody'></tbody>");
    
    $(".topTableContent").html(div);

    $.get("./bug/list", function (data, status) {
        bug_data = JSON.parse(JSON.stringify(data));

        var page_count = bug_data.length/5;
        var page_html = "<div class='page'>"
    	  		  + "<a href='#' onClick ='getPageNoForBugOnPrevNext(\"prev\")'>&laquo;</a>";
        for(var p = 0; p < page_count && page_count < 5; p++) {
      	    page_html += "<a href='#' onClick ='showLimitedBugRows("+ (p+1) + ")'>" + (p+1) + "</a>";
        }
	  		  //+ "<a href='#' onClick ='showLimitedRows('6')'>&raquo;</a>"
        page_html += "<a href='#' onClick ='getPageNoForBugOnPrevNext(\"next\")'>&raquo;</a></div>";
        
        $(page_html).appendTo(head);
        
        showLimitedBugRows(1);
        
    });

    var button = $("<input type='button' class='button'  id='button' value='Create Error' onclick='showCreateBugPanel()' />").appendTo(div);
    $(".rightBody").css("display", "block");
    $(".assainBody").hide();
}

function getPageNoForBugOnPrevNext(x) {
	var pageNo = -1;
	var last_bug_page = parseInt(localStorage.getItem("last_bug_page"));
	var max_pages_possibile = bug_data.length/5;
	
	if(x === "prev")
		pageNo = last_bug_page - 1;
	else if(x === "next")
		pageNo = last_bug_page + 1;
	
	if(pageNo < 1 || pageNo > max_pages_possibile)
		alert("No more pages");
	else
		showLimitedBugRows(pageNo);
}

function showLimitedBugRows(pageNo) {
	console.log(pageNo);
    $("#bugTblBody").html("");
	localStorage.setItem("last_bug_page", pageNo);
	
	for(var i = (pageNo-1)*5; i <= pageNo*5-1 && i < bug_data.length; i++) {
        var v = bug_data[i];
        var asd;
        var aed;
        if (v.actual_start_date == "No Updates") {
            asd = "No Updates";
        }
        else {
            asd = new Date();
            asd.setTime(v.actual_start_date);
            asd = asd.getDate() + "-" + (asd.getMonth() + 1) + "-" + asd.getFullYear();
        }

        if (v.actual_end_date == "No Updates") {
            aed = "No Updates";
        }
        else {
            aed = new Date();
            aed.setTime(v.actual_end_date);
            aed = aed.getDate() + "-" + (aed.getMonth() + 1) + "-" + aed.getFullYear();
        }

        var esd = new Date();
        esd.setTime(v.expected_start_date);
        esd = esd.getDate() + "-" + (esd.getMonth() + 1) + "-" + esd.getFullYear();
        var eed = new Date();
        eed.setTime(v.expected_end_date);
        eed = eed.getDate() + "-" + (eed.getMonth() + 1) + "-" + eed.getFullYear();


        var bugname = v.name;
        var bug = bugname.split(".");
        bugname = bug[0] + "Defect";

        var bugData = "<tr>"
            + "<td>" + v.project_name + "</td>"
            + "<td>" + bugname + "</td>"
            + "<td>" + v.file_name + "</td>"
            + "<td>" + v.details + "</td>"
            + "<td>" + v.assignee + "</td>"
            + "<td>" + v.assignee_cmnt + "</td>"
            + "<td>" + v.status + "</td>"
            + "<td>" + v.priority + "</td>"
            + "<td>" + v.creation_date + "</td>"
            + "<td>" + esd + "</td>"
            + "<td>" + eed + "</td>"
            + "<td>" + asd + "</td>"
            + "<td>" + aed + "</td>"
            + "<td>" + v.updated_date + "</td>"
            + "<td><a href='./bug/downloadReport?bug_id=" + v.id + "&reportName=" + v.reportName + "&mimeType=" + v.mimeType + "' target='_blank'>Report</a></td>"
            + "<td><a href='#' onClick='deletebug(" + "\"" + v.id + "\"" + ");'>Delete</a></td>" + "<td>"
            + "<a href='#' onclick='updateBugModal(" + i + ");'>Update</a>" + "</td>"
            + "<td><a href='#' onClick='assignbug(" + "\"" + v.id + "\"" + ','
            + "\"" + v.name + "\"" + ");'>Assign</a></td>" + "</tr>";
        $("#bugTblBody").append(bugData)
    }
}

function showCreateBugPanel() {
    var html = "<p class='updateHead'>Create Defects</p>"
        + "<label>Bug Type</label>"
        + "<select id='bug_type'>"
        + "<option>Bug</option>"
        + "<option>Issue</option>"
        + "</select><br/>"
        + "<label>File ID</label>"
        + "<select id='fileID' onchange='getFileDetails()'></select>"
        + "<input type='button' class='button' style='margin-left:7px;margin-bottom:3px;padding-top:3px' value='Load ID' onclick='loadFileID()' />"
        + "<br />"
        + "<label>File Name</label>"
        + "<input type='text' id='fileName'readonly />"
        + "<br />"
        + "<label>Project Name</label>"
        + "<input type='text' id='projectName' readonly />"
        + "<br />"
        + "<label>Error Name</label>"
        + "<input type='text' id='errName' />"
        + "<br />"
        + "<label>Status</label>"
        + "<select id='errStatus'>"
        + "<option value=''>Select</option>"
        + "<option value='Not Assigned'>Not Assigned</option>"
        + "<option value='Assigned'>Assigned</option>"
        + "<option value='Work In Progress'>Work In Progress</option>"
        + "<option value='Completed'>Completed</option>"
        + "</select>" + "<br />"
        + "<label>Priority</label>"
        + "<select id='err_priority'>"
        + "<option value=''>Select</option>"
        + "<option value='p1'>P1</option>"
        + "<option value='p2'>P2</option>"
        + "<option value='p3'>P3</option>"
        + "</select>" + "<br />"
        + "<label>Expected Start-Date</label>"
        + "<input type='text' id='err_ESD' readonly />"
        + "<br />"
        + "<label>Expected End-Date</label>"
        + "<input type='text' id='err_EED' readonly />"
        + "<br />"
        + "<label>Error Description</label>"
        + "<textarea rows='4' cols='50' id='errDes'></textarea>"
        + "<br />"
        + "<label>Upload File</label>"
        + "<input  type='file' id='bugFile' class='uploadFile'/>" + "<br />" + "<br />"
        + "<input type='button' class='button' id='botButton' value='Add Error' onclick='createBug()' />"
        + "<br />" + "<br />"

    $(".assainBody").html(html);
    $(".assainBody").show();

    $("#err_ESD").datepicker({dateFormat: 'dd-mm-yy'});
    $("#err_EED").datepicker({dateFormat: 'dd-mm-yy'});


}

function loadFileID() {
    $.get("./fileDetails/list", function (data, status) {
        $("#fileID").html("");
        fileID = JSON.parse(JSON.stringify(data));

        $.each(fileID, function (k, v) {
            $("#fileID").append(
                '<option value=' + v.id + '>' + v.id + '</option>');
        });

        getFileDetails();

    });
}
function getFileDetails() {
    $.each(fileID, function (k, v) {
        if (v.id == $("#fileID").val()) {
            $("#fileName").val(v.name)
            $("#projectName").val(v.project_name);
        }
    });
}

function createBug() {

    var fd = new FormData();
    fd.append("file", document.getElementById('bugFile').files[0]);
    fd.append("fileID", $("#fileID").val());
    fd.append("fileName", $("#fileName").val());
    fd.append("projectName", $("#projectName").val());
    fd.append("errName", $("#errName").val());
    fd.append("errDes", $("#errDes").val());
    fd.append("status", $("#errStatus").val());
    fd.append("priority", $("#err_priority").val());
    fd.append("esd", $("#err_ESD").val());
    fd.append("eed", $("#err_ESD").val());

    $.ajax({
        url: './bug/add',
        data: fd,
        processData: false,
        contentType: false,
        enctype: 'multipart/form-data',
        type: 'POST',
        success: function (data) {
            showManageBugsPanel();
        },
        error: function (err) {
            // alert(err);
        }

    });
}

/*if (($("#errName").val() == "") || ($("#errDes").val() == ""))
 alert("Please enter the details to proceed further");
 else {
 $.post("./bug/add", {
 fileID: $("#fileID").val(),
 fileName: $("#fileName").val(),
 projectName: $("#projectName").val(),
 errName: $("#errName").val(),
 errDes: $("#errDes").val(),
 status:$("#errStatus").val(),
 priority:$("#err_priority").val(),
 esd : $("#err_ESD").val(),
 eed : $("#err_ESD").val(),
 }, function (data, status) {
 data = JSON.stringify(data);
 data = JSON.parse(data);
 if (data.success)
 $("#status").html(data.msg);
 showManageBugsPanel();
 });
 }
 */


function updateBugModal(i) {

    var v = bug_data[i];
    var bugid = v.id;
    var bugname = v.name;
    var bugdes = v.details;
    var bugasgn = v.assignee;
    var comments = v.assignee_cmnt;
    var assignee = v.assignee;
    var status = v.status;
    var priority = v.priority;
    var asd = v.actual_start_date;
    var aed = v.actual_end_date;

    if (asd == "No Updates") {
        asd = "No Updates";
    }
    else {
        asd = new Date();
        asd.setTime(v.actual_start_date);
        asd = asd.getDate() + "-" + (asd.getMonth() + 1) + "-" + asd.getFullYear();
    }
    if (aed == "No Updates") {
        aed = "No Updates";
    }
    else {
        aed = new Date();
        aed.setTime(v.actual_end_date);
        aed = aed.getDate() + "-" + (aed.getMonth() + 1) + "-" + aed.getFullYear();
    }

    $.get("./resource/list", function (data, status) {
        $("#assignBugUpdate").html("");
        resourceData = JSON.parse(JSON.stringify(data));
        $.each(resourceData, function (k, v) {
            console.log(v.resource_id + "---------------")
            $("#assignBugUpdate").append('<option value=' + v.resource_id + '>' + v.resource_name + '</option>');
        });

    });
    var html = "<p class='updateHead'>Edit Error Details</p>"
        + "<input type='hidden' id='bId' value='" + bugid + "'/>"
        + "<label>Bug Name</label>"
        + "<input type='text' id='newbugname' value='" + bugname + "'/>"
        + "<br />"
        + "<label>Status</label>"
        + "<select id='newbugstatus'>"
        + "<option value='Not Assigned'>Not Assigned</option>"
        + "<option value='Assigned'>Assigned</option>"
        + "<option value='Work In Progress'>Work In Progress</option>"
        + "<option value='Completed'>Completed</option>"
        + "</select>" + "<br />"
        + "<label>Priority</label>"
        + "<select id='new_err_priority'>"
        + "<option value='p1'>P1</option>"
        + "<option value='p2'>P2</option>"
        + "<option value='p3'>P3</option>"
        + "</select>" + "<br />";
    if (assignee != "Not Assigned") {
        html += "<label>Resource</label>"
            + "<select id='assignBugUpdate'></select>" + "<br />"
    }
    html += "<label>Start-Date</label>"
        + "<input type='text' id='newbugsd' value='" + asd + "'/>" + "<br />"
        + "<label>End-Date</label>"
        + "<input type='text' id='newbuged' value='" + aed + "'/>" + "<br />"
        + "<label>Bug Details</label>"
        + "<textarea rows='4' cols='45' id='newbugDes'>" + bugdes + "</textarea>"
        + "<br />"
        + "<label>Comments</label>"
        + "<textarea rows='4' cols='45' id='newbugCom'>" + comments + "</textarea>"
        + "<br />"
        + "<input type='button' class='button'  id='botButton' value='Update' onclick='updatebug()' />"
        + "<br />" + "<br />"

    $(".assainBody").html(html);
    $(".assainBody").show();
    $("#newbugsd").datepicker({dateFormat: 'dd-mm-yy'});
    $("#newbuged").datepicker({dateFormat: 'dd-mm-yy'});
}


function updatebug() {
    var assignee;
    if ($("#assignBugUpdate").val() == null) {
        assignee = "Not Assigned"
    }
    else {
        assignee = $("#assignBugUpdate").val();
    }
    $.post("./bug/update", {
        bug_id: $("#bId").val(),
        bug_name: $("#newbugname").val(),
        bug_details: $("#newbugDes").val(),
        comments: $("#newbugCom").val(),
        start_date: $("#newbugsd").val(),
        end_date: $("#newbuged").val(),
        status: $("#newbugstatus").val(),
        priority: $("#new_err_priority").val(),
        assignee: assignee,
    }, function (data, status) {
        data = JSON.stringify(data);
        data = JSON.parse(data);
        if (data.success)
            $("#status").html(data.success);
        showManageBugsPanel();
    });

}


function assignbug(bid, bname) {
    var bugid = bid;
    var bugname = bname;
    var html = /*"<span id='status'></span>"
     + "<br/>"
     +*/ "<p class='updateHead'>Assign Task</p>"
        + "<label>Resource ID</label>"
        + "<select id='rsrcid'></select>"
        + "<input type='button' class='button' style='margin-left:7px;margin-bottom:3px;padding-top:3px' value='Load ID' onclick='loadBugRsrcID()' />"
        + "<br />"
        /*+ "<label>Resource Name</label>"
        + "<input type='text' id='rsrcname' readonly />"
        + "<br />"*/
        + "<label>Comments</label>"
        + "<textarea rows='4' cols='50' id='rsrcCom'></textarea>"
        + "<br />"
        + "<input type='button' class='button' id='botButton' value='Assign Defect' onclick='assignRsrcbug("
        + "\"" + bugid + "\"" + "," + "\"" + bugname + "\"" + ")' />"
        + "<br />" + "<br />"
    $(".assainBody").html(html);
    $(".assainBody").show();

}

function loadBugRsrcID() {
    $.get("./resource/listAll", function (data, status) {
        $("#rsrcid").html("");
        resourceid = JSON.parse(JSON.stringify(data));

        $.each(resourceid, function (key, val) {
            $("#rsrcid").append(
                '<option value=' + val.resource_id + '>' + val.resource_name
                + '</option>');
        });

        getBugRsrcName();
    });
}
/*function getBugRsrcName() {
    $.each(resourceid, function (key, val) {
        if (val.resource_id == $("#rsrcid").val()) {
            $("#rsrcname").val(val.resource_name);
        }
    });
}*/

function assignRsrcbug(bugid, bugnme) {
    $.post("./bug/assign", {
        rsrcid: $("#rsrcid").val(),
        //rsrcname: $("#rsrcname").val(),
        bugid: bugid,
        //bugname: bugnme,
        comments: $("#rsrcCom").val(),
    }, function (data, status) {
        data = JSON.parse(JSON.stringify(data));
        if (data.success)
            $("#status").html(data.msg);
        showManageBugsPanel();
    });

}

function deletebug(bugid) {
    $.post("./bug/delete", {
        bug_id: bugid
    }, function (data, status) {
        console.log(" Deleted " + bugid);
        if (data.success)
            $("#status").html(data.success);
        showManageBugsPanel();
    });
}

//RESOURCE Management
function showManageResourcePanel() {
    var div = $("<div></div>");

    var head = $("<h3 class='titleHead'>Resource Management</h3>").appendTo(div);
    var status = $("<p id='status'></p>").appendTo(div);
    var table = $("<table id=DynamicResource class=dynoTable border=1></table>").appendTo(div);
    table.append("<tr>" + "<th style='display:none;'>Resource-ID</th>"
        + "<th>Resource-Name</th>"
        + "<th>Description</th>"
        + "<th>Email-ID</th>"
        + "<th>Role</th>"
        + "<th>Assigned-Task</th>"
        + "<th>Assigned-Bug</th>"
        + "<th>Creation-Date</th>"
        + "<th>Updated-Date</th>"
        + "<th>Delete Error</th>"
        + "<th>Update Error</th>" + "</tr>");

    $.get("./resource/listTaskBug", function (data, status) {
        data = JSON.parse(JSON.stringify(data));

        $.each(data, function (k, v) {

            //$.each(v.tasks, function(tk, tv){
            var resourceData = "<tr>" + "<td style='display:none;'>" + v.resource_id + "</td>"
                + "<td>" + v.resource_name + "</td>"
                + "<td>" + v.resource_dtls + "</td>"
                + "<td>" + v.email + "</td>"
                + "<td>" + v.role + "</td>"
                + "<td><a href='#' onclick=''></a></td>"
                + "<td>" + /*json[j].bugnme + */"</td>"
                + "<td>" + v.creation_date + "</td>"
                + "<td>" + v.updated_date + "</td>"
                + "<td><a href='#' onClick='deleteresource(" + "\"" + v.resource_id + "\"" + ");'>Delete</a></td>"
                + "<td>" + "<a href='#' onClick='updateRsrcModal(" + "\"" + v.resource_id + "\"" + ','
                + "\"" + v.resource_name + "\"" + ','
                + "\"" + v.resource_dtls + "\"" + ','
                + "\"" + v.role + "\"" + ','
                + "\"" + v.email + "\"" + ");'>Update</a>" + "</td>"
                + "</tr>";
            $(table).append(resourceData);
            //  });

        });
        $(".topTableContent").html(div);
    });
    var button = $("<input type='button' class='button'  id='button' value='Create Resource' onclick='showCreateResourcePanel()'/>").appendTo(div);
    $(".rightBody").css("display", "block");
    $(".assainBody").hide();
}

function showCreateResourcePanel() {
    var html = /*"<span id='status'></span>"
     + "<br/>"
     +*/ "<p class='updateHead'>Create Resource</p>"
        + "<label>Resource Name</label>"
        + "<input type='text' id='rs_name' />"
        + "<br />"
        + "<label>Role</label>"
        + "<select id='rs_role'>";

    if ($("#user_role").val() == 0) {
        html += "<option value='ADMIN'>Admin</option>"
            + "<option value='MANAGER'>Manager</option>";
    }

    html += "<option value='DEVELOPER'>Developer</option>"
    	+ "<option value='INFRA_USER'>Infrastructure User</option>"
    	+ "<option value='DEPLOYER'>Deployer</option>"
    	+ "<option value='TEST_MANAGER'>Test Manager</option>"
    	+ "<option value='RELEASE_MANAGER'>Release Manager</option>"
        + "</select>"
        + "<br />"
        + "<label>Email ID</label>"
        + "<input type='text' id='rs_email'/>"
        + "<br />"
        + "<label>Resource Detail</label>"
        + "<textarea rows='4' cols='45' id='rs_des'></textarea>"
        + "<br />"
        + "<input type='button' class='button'  id='botButton' value='Add Resource' onclick='createResource()' />"
        + "<br />" + "<br />"

    $(".assainBody").html(html);
    $(".assainBody").show();
}

function createResource() {
    if (($("#rs_name").val() == "") || ($("#rs_des").val() == "") || ($("#rs_role").val() == "")
        || ($("#rs_email").val() == ""))
        alert("Please enter the details proceed further");
    else {
        $.post("./resource/add", {
            rs_name: $("#rs_name").val(),
            rs_des: $("#rs_des").val(),
            rs_role: $("#rs_role").val(),
            rs_email: $("#rs_email").val(),
        }, function (data, status) {
            data = JSON.stringify(data);
            data = JSON.parse(data);
            if (data.success)
                $("#status").html(data.msg);
            showManageResourcePanel();
        });
    }
}

//ENV Management
function showManageEnvPanel() {
    var div = $("<div></div>");
    var head = $("<h3 class='titleHead'>Environment Management</h3>").appendTo(div);
    var status = $("<p id='status'></p>").appendTo(div);
    var table = $("<table id=DynamicEnv class=dynoTable border=1></table>")
        .appendTo(div);
    table.append("<tr>" + "<th style='display:none;'>Environment-ID</th>"
        + "<th>Environment-Name</th>"
        + "<th>Description</th>"
        + "<th>Project Name</th>"
        + "<th>User ID</th>"
        + "<th style='display:none;'>Password</th>"
        + "<th>Creation-Date</th>"
        + "<th>Updated-Date</th>"
        + "<th>Delete Env</th>"
        + "<th>Update Env</th>" + "</tr>");

    $.get("./env/list", function (data, status) {
        data = JSON.parse(JSON.stringify(data));

        $.each(data, function (k, v) {
            var envData = "<tr>" + "<td style='display:none;'>" + v.id + "</td>"
                + "<td>" + v.name + "</td>"
                + "<td>" + v.desc + "</td>"
                + "<td>" + v.project_name + "</td>"
                + "<td>" + v.user_id + "</td>"
                    //+ "<td style='display:none;'>" + v.env_pwd + "</td>"
                + "<td>" + v.creation_date + "</td>"
                    /*	+ "<td>" + json[j].CB + "</td>" */
                + "<td>" + v.updated_date + "</td>"
                + "<td><a href='#' onClick='deleteenv(" + "\"" + v.id + "\"" + ");'>Delete</a></td>"
                + "<td>" + "<a href='#' onClick='updateEnvModal(" + "\"" + v.id + "\"" + ','
                + "\"" + v.name + "\"" + ','
                + "\"" + v.user_id + "\"" + ','
                    //+ "\"" + json[j].env_pwd + "\"" + ','
                + "\"" + v.desc + "\"" + ")'>Update</a>" + "</td>"
                + "</tr>";
            $(table).append(envData)

        });
        $(".topTableContent").html(div);
    });
    var button = $("<input type='button' class='button'  id='button' value='Create Environment' onclick='discoverEnvironment()' />").appendTo(div);
    $(".rightBody").css("display", "block");
    $(".assainBody").hide();
}

function discoverEnvironment() {
    var html = /*"<span id='status'></span>"
     + "<br/>"
     +*/ "<p class='updateHead'>Create Environment</p>"
        + "<label>Project ID</label>"
        + "<select id='proId' onchange='getProjName()'></select>"
        + "<input type='button' class='button' style='margin-left:7px;margin-bottom:3px;padding-top:3px' value='Load ID' onclick='loadProjectID()' />"
        + "<br />"
        + "<label>Project Name</label>"
        + "<input type='text' id='proName' readonly />"
        + "<br />"
        + "<label>User ID</label>"
        + "<input type='text' id='env_userid' />"
        + "<br />"
        + "<label>Password</label>"
        + "<input type='password' id='env_pwd' />"
        + "<br />"
        + "<label>Environment Name</label>"
        + "<input type='text' id='env_name' />"
        + "<br />"
        + "<label>Environment Description</label>"
        + "<textarea rows='4' cols='50' id='env_des'></textarea>"
        + "<br />"
        + "<input type='button' class='button'  id='botButton' value='Add Environment' onclick='createEnvironment()' />"
        + "<br />" + "<br />"

    $(".assainBody").html(html);
    $(".assainBody").show();
}

function loadProjectID() {
    $.get("./project/list", function (data, status) {
        $("#proId").html("");
        proID = JSON.parse(JSON.stringify(data));

        $.each(proID, function (k, v) {
            $("#proId").append(
                '<option value=' + v.project_id + '>' + v.project_id
                + '</option>');
        });

        getProjName();
    });
}

function getProjName() {
    $.each(proID, function (key, val) {
        if (val.project_id == $("#proId").val()) {
            $("#proName").val(val.project_name);
        }
    });
}

function createEnvironment() {
    if (($("#env_name").val() == "") || ($("#env_des").val() == ""))
        alert("Please enter the details proceed further");
    else {
        $.post("./env/add", {
            pro_id: $("#proId").val(),
            pro_name: $("#proName").val(),
            env_userid: $("#env_userid").val(),
            env_pwd: $("#env_pwd").val(),
            env_name: $("#env_name").val(),
            env_details: $("#env_des").val(),
        }, function (data, status) {
            data = JSON.parse(JSON.stringify(data));
            if (data.success)
                $("#status").html(data.msg);
            showManageEnvPanel();
        });
    }

}

function showManageInstancePanel() {
    var div = $("<div></div>");
    var head = $("<h3 class='titleHead'>Instance Management</h3>").appendTo(div);
    var status = $("<p id='status'></p>").appendTo(div);
    var table = $("<table id=DynamicInst class=dynoTable border=1></table>")
        .appendTo(div);
    table.append("<tr>" + "<th style='display:none;'>Instance-ID</th>"
        + "<th>Environment-Name</th>"
        + "<th>Instance-Name</th>"
        + "<th>Description</th>"
        + "<th>Host-Name</th>"
        + "<th>Category</th>"
        + "<th>User ID</th>"
        + "<th style='display:none;'>Password</th>"
        + "<th style='display:none;'>Environment-ID</th>"
        + "<th style='display:none;'>Created-By</th>"
        + "<th>Creation-Date</th>"
        + "<th>Updated-Date</th>"
        + "<th>Delete Instance</th>"
        + "<th>Update Instance</th>" + "</tr>");


    $.get("./instance/list", function (data, status) {
        data = JSON.parse(JSON.stringify(data));

        $.each(data, function (k, v) {
            var instData = "<tr>" + "<td style='display:none;'>" + v.id + "</td>"
                + "<td>" + v.env_name + "</td>"
                + "<td>" + v.name + "</td>"
                + "<td>" + v.desc + "</td>"
                + "<td>" + v.host_name + "</td>"
                + "<td>" + v.category + "</td>"
                + "<td>" + v.user_id + "</td>"
                    //+ "<td style='display:none;'>" + json[j].inst_pwd + "</td>"
                    //+ "<td style='display:none;'>" + json[j].Eid + "</td>"
                    //+ "<td style='display:none;'>" + json[j].CB + "</td>"
                + "<td>" + v.creation_date + "</td>"
                + "<td>" + v.updated_date + "</td>"
                + "<td><a href='#' onClick='deleteinstance(" + "\"" + v.id + "\"" + ");'>Delete</a></td>"
                + "<td>"
                + "<a href='#' onClick='updateInstanceModal(" + "\"" + v.id + "\"" + ','
                + "\"" + v.name + "\"" + ','
                + "\"" + v.desc + "\"" + ','
                + "\"" + v.host_name + "\"" + ','
                + "\"" + v.category + "\"" + ','
                + "\"" + v.user_id + "\"" + ','
                + "\"" + /*v.inst_pwd +*/ "\"" + ");'>Update</a>"
                + "</td>" + "</tr>";

            $(table).append(instData)

        });
        $(".topTableContent").html(div);
    });
    var button = $("<input type='button' class='button'  id='button' value='Create Instance' onclick='showCreateInstancePanel()' />").appendTo(div);
    $(".rightBody").css("display", "block");
    $(".assainBody").hide();
}

function showCreateInstancePanel() {
    var html = /*"<span id='status'></span>"
     + "<br/>"
     + */"<p class='updateHead'>Create Instance</p>"
        + "<label>Environ ID</label>"
        + "<select id='envID' onchange='getEnvName()'></select>"
        + "<input type='button' class='button' style='margin-left:7px;margin-bottom:3px;padding-top:3px' value='Load ID' onclick='loadEnv_ID()' />"
        + "<br />"
        + "<label>Environ Name</label>"
        + "<input type='text' id='eName' readonly />"
        + "<br />"
        + "<label>Instance Name</label>"
        + "<input type='text' id='inst_name' />"
        + "<br />"
        + "<label>Category</label>"
        + "<select id='category'>"
        + "<option value='DEV'>DEV</option>"
        + "<option value='ST'>ST</option>"
        + "<option value='SIT'>SIT</option>"
        + "<option value='UAT'>UAT</option>"
        + "<option value='PT'>PT</option>"
        + "<option value='SeT'>SeT</option>"
        + "<option value='PRE_PROD'>PRE_PROD</option>"
        + "<option value='PROD'>PROD</option>"
        + "</select>" + "<br />"
        + "<label>Host-Name</label>"
        + "<input type='text' id='host_name' />"
        + "<br />"
        + "<label>User ID</label>"
        + "<input type='text' id='inst_userid' />"
        + "<br />"
        + "<label>Password</label>"
        + "<input type='password' id='inst_pwd' />"
        + "<br />"
        + "<label>Instance Description</label>"
        + "<textarea rows='4' cols='50' id='inst_detail'></textarea>"
        + "<br />"
        + "<input type='button' class='button' id='botButton' value='Add Instance' onclick='createInstance()' />"
        + "<br />" + "<br />"

    $(".assainBody").html(html);
    $(".assainBody").show();
}

function loadEnv_ID() {
    $.get("./env/list", function (data, status) {
        $("#envID").html("");
        envID = JSON.parse(JSON.stringify(data));

        $.each(envID, function (key, val) {
            $("#envID").append(
                '<option value=' + val.id + '>' + val.id
                + '</option>');
        });

        getEnvName();
    });
}

function getEnvName() {
    $.each(envID, function (key, val) {
        if (val.id == $("#envID").val()) {
            $("#eName").val(val.name);
        }
    });
}

function createInstance() {
    if (($("#inst_name").val() == "") || ($("#inst_detail").val() == "")
        || ($("#host_name").val() == "") || ($("#category").val() == ""))
        alert("Please enter the details proceed further");
    else {
        $.post("./instance/add", {
            envID: $("#envID").val(),
            inst_name: $("#inst_name").val(),
            inst_detail: $("#inst_detail").val(),
            host_name: $("#host_name").val(),
            inst_user: $("#inst_userid").val(),
            inst_pwd: $("#inst_pwd").val(),
            category: $("#category").val(),
        }, function (data, status) {
            data = JSON.parse(JSON.stringify(data));
            if (data.success)
                $("#status").html(data.msg);
            showManageInstancePanel();
        });
    }
}


/**********************************************/


function deleteresource(resourceid) {
    $.post("./../update/deleteResource", {
        resource_id: resourceid
    }, function (data, status) {
        console.log(" Deleted " + resourceid);
        showManageResourcePanel();
    });

}

function updateRsrcModal(resourceid, resourcename, resourcedes, role, emailid) {
    var html = "<p class='updateHead'>Edit Resource Details</p>"
        + "<input type='hidden' id='rsid' value='" + resourceid + "'/>"
        + "<label>Resource Name</label>"
        + "<input type='text' id='newrsname' value='" + resourcename + "' readonly/>"
        + "<br />"
        + "<label>Role</label>"
        + "<select id='newrsrole'>";

    if ($("#user_role").val() == 0) {
        html += "<option value='ADMIN'>Admin</option>"
            + "<option value='MANAGER'>Manager</option>";
    }

    html += "<option value='DEVELOPER'>Developer</option>"
    	+ "<option value='INFRA_USER'>Infrastructure User</option>"
    	+ "<option value='DEPLOYER'>Deployer</option>"
    	+ "<option value='TEST_MANAGER'>Test Manager</option>"
    	+ "<option value='RELEASE_MANAGER'>Release Manager</option>"
        + "</select><br />"
        //+ "<input type='text' id='newrsrole' value='" + role + "'/>" + "<br />"
        + "<label>Email-ID</label>"
        + "<input type='text' id='newrsmail' value='" + emailid + "' readonly />" + "<br />"
        /*+ "<label>Resource Details</label>"
        + "<textarea rows='4' cols='45' id='newrsDes'>" + resourcedes + "</textarea>"
        + "<br />"*/
        + "<input type='button' class='button'  id='botButton' value='Update' onclick='updateresource()' />"
        + "<br />" + "<br />"

    $(".assainBody").html(html);
    $(".assainBody").show();

}


function updateresource() {
    $.post("./resource//update/role", {
        resource_id: $("#rsid").val(),
        resource_role: $("#newrsrole").val(),
    }, function (data, status) {
        data = JSON.stringify(data);
        data = JSON.parse(data);
        if (data.success)
            $("#status").html(data.success);
        showManageResourcePanel();
    });

}

function deleteenv(eid) {
    $.post("./../update/deleteEnv", {
        env_id: eid
    }, function (data, status) {
        console.log(" Deleted " + eid);
        if (data.success)
            $("#status").html(data.success);
        showManageEnvPanel();
    });

}
function updateEnvModal(eid, ename, euser, epwd, des) {
    var html = "<p class='updateHead'>Edit Environment Details</p>"
        + "<input type='hidden' id='enid' value='" + eid + "'/>"
        + "<label>Environment Name</label>"
        + "<input type='text' id='newenvname' value='" + ename + "'/>"
        + "<br />"
        + "<label>User ID</label>"
        + "<input type='text' id='newenvuser' value='" + euser + "'/>"
        + "<br />"
        + "<label>Password</label>"
        + "<input type='text' id='newenvpwd' value='" + epwd + "'/>"
        + "<br />"
        + "<label>Environment Details</label>"
        + "<textarea rows='4' cols='45' id='newenvDes'>" + des + "</textarea>"
        + "<br />"
        + "<input type='button' class='button'  id='botButton' value='Update' onclick='updateEnv()' />"
        + "<br />" + "<br />"

    $(".assainBody").html(html);
    $(".assainBody").show();

}


function updateEnv() {
    $.post("./../update/updateEnviron", {
        env_id: $("#enid").val(),
        env_name: $("#newenvname").val(),
        env_user: $("#newenvuser").val(),
        env_pwd: $("#newenvpwd").val(),
        env_details: $("#newenvDes").val(),
    }, function (data, status) {
        data = JSON.stringify(data);
        data = JSON.parse(data);
        if (data.success)
            $("#status").html(data.success);
    });
    showManageEnvPanel();
}


function deleteinstance(Inid) {
    $.post("./../update/deleteInstance", {
        inst_id: Inid
    }, function (data, status) {
        console.log(" Deleted " + Inid);
        if (data.success)
            $("#status").html(data.success);
        showManageInstancePanel();
    });

}
function updateInstanceModal(inst_id, inst_name, inst_details, host_name, category, inst_user, inst_pwd) {

    var html = "<p class='updateHead'>Edit Instance Details</p>"
        + "<input type='hidden' id='insid' value='" + inst_id + "'/>"
        + "<label>Instance Name</label>"
        + "<input type='text' id='newinsname' value='" + inst_name + "'/>"
        + "<br />"
        + "<label>Host Name</label>"
        + "<input type='text' id='newhname' value='" + host_name + "'/>" + "<br />"
        + "<label>Category</label>"
        + "<select id='newcat'>"
        + "<option value='" + category + "'>" + category + "</option>"
        + "<option value='DEV'>DEV</option>"
        + "<option value='ST'>ST</option>"
        + "<option value='SIT'>SIT</option>"
        + "<option value='UAT'>UAT</option>"
        + "<option value='PT'>PT</option>"
        + "<option value='SeT'>SeT</option>"
        + "<option value='PRE_PROD'>PRE_PROD</option>"
        + "<option value='PROD'>PROD</option>"
        + "</select>" + "<br />"
        + "<label>User ID</label>"
        + "<input type='text' id='newinstuser' value='" + inst_user + "'/>" + "<br />"
        + "<label>Password</label>"
        + "<input type='password' id='newinstpwd' value='" + inst_pwd + "'/>" + "<br />"
        + "<label>Instance Details</label>"
        + "<textarea rows='4' cols='45' id='newinsDes'>" + inst_details + "</textarea>"
        + "<br />"
        + "<input type='button' class='button'  id='botButton' value='Update' onclick='updateInstance()' />"
        + "<br />" + "<br />"

    $(".assainBody").html(html);
    $(".assainBody").show();

}

function updateInstance() {
    $.post("./../update/updateInstance", {
        inst_id: $("#insid").val(),
        inst_name: $("#newinsname").val(),
        inst_details: $("#newinsDes").val(),
        host_name: $("#newhname").val(),
        category: $("#newcat").val(),
        inst_user: $("#newinstuser").val(),
        inst_pwd: $("#newinstpwd").val(),
    }, function (data, status) {
        data = JSON.stringify(data);
        data = JSON.parse(data);
        if (data.success)
            $("#status").html(data.success);
        showManageInstancePanel();
    });

}

