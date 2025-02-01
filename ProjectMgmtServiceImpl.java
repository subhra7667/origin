package com.wipro.devops.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.wipro.devops.beans.Project;
import com.wipro.devops.beans.Projectmanagement;
import com.wipro.devops.beans.Task;
import com.wipro.devops.beans.User;
import com.wipro.devops.dao.ProjectMgmtDao;
import com.wipro.devops.dao.TaskDAO;
import com.wipro.devops.dao.TaskReportDAO;
import com.wipro.devops.service.ProjectManagementService;
import com.wipro.devops.service.ProjectService;
import com.wipro.devops.service.ResourceService;
import com.wipro.devops.service.WorkflowStageFilesService;

public class ProjectMgmtServiceImpl implements ProjectManagementService{
	
	@Autowired
    private ProjectManagementService projectService;
    @Autowired
    private ProjectMgmtDao projectMgmtDao;
    
    
    


	@Override
	@Transactional
	public Projectmanagement add(User user, String projectID, String user_name, String password, String tool_name,
			String protocol_type, String url) {
		// TODO Auto-generated method stub
		
		Projectmanagement p=new Projectmanagement( user_name,  password,  tool_name,
				 protocol_type,  String url);		
        p.setPgmtId(projectService.findByID(projectID));
        p.setCreatedBy(user);
		projectMgmtDao.create(p);

		return p;
	}

	@Override
	public Projectmanagement update(String userName, String password, String tool_name, String protocol_type,
			String url) {
		// TODO Auto-generated method stub]
		Projectmanagement p = ProjectMgmtDao.read(pgmt_id);
		return null;
	}

	@Override
	public boolean delete(String pgmt_Id) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Projectmanagement findByID(String id) {

	        return projectMgmtDao.read(id);
	    }

	

	@Override
	public List<Projectmanagement> findAllByUID(User user) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Projectmanagement> findAllByPID(String pID) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Projectmanagement> findAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Projectmanagement update(String pgmt_id, String user_name, String password, String tool_name,
			String protocol_type, String url) {
		// TODO Auto-generated method stub
		return null;
	}

}
