package com.wipro.devops.service;


import java.util.List;


import com.wipro.devops.beans.Projectmanagement;

import com.wipro.devops.beans.User;

public interface ProjectManagementService {
	
	Projectmanagement add(User user,String projectId, String userName, String password, String tool_name, String protocol_type,
			String url);
	Projectmanagement update(String pgmt_id,String user_name, String password, String tool_name, String protocol_type,
			String url);

	boolean delete(String pgmt_Id);
	
	 Projectmanagement findByID(String id);
	 List<Projectmanagement> findAllByUID(User user);
	 List<Projectmanagement> findAllByPID(String pID);
	 List<Projectmanagement> findAll();
}
