package com.wipro.devops.dao;

import java.util.List;

import com.wipro.devops.beans.Project;
import com.wipro.devops.beans.Projectmanagement;



public interface ProjectMgmtDao extends GenericDao<Projectmanagement, String>{
	 List<Projectmanagement> findAllByUID(String id);
	 List<Projectmanagement> findAllByPID(List<Project> pID);
	 List<Projectmanagement> findAll();

}
