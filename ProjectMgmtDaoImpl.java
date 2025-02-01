package com.wipro.devops.dao.impl.jpa;

import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.wipro.devops.beans.Project;
import com.wipro.devops.beans.Projectmanagement;

import com.wipro.devops.dao.ProjectMgmtDao;


public class ProjectMgmtDaoImpl extends GenericDAOImpl<Projectmanagement, String>
   implements ProjectMgmtDao {
	
	
	

	
	public ProjectMgmtDaoImpl() {

		super(Projectmanagement.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	 @Transactional(readOnly = true, propagation = Propagation.NOT_SUPPORTED)
	public List<Projectmanagement> findAllByUID(String id) {
		return em.createNamedQuery("Projectmanagement.findAllByUID", Projectmanagement.class)
                .setParameter("uid", id)
                .getResultList();
    }
	

	@Override
	public List<Projectmanagement> findAllByPID(List<Project> pID) {
		return em.createNamedQuery("Projectmanagement.findAllByPID", Projectmanagement.class)
                .setParameter("pId", pID)
                .getResultList();
    }

	@Override
	public List<Projectmanagement> findAll() {
		return em.createNamedQuery("Projectmanagement.findAll", Projectmanagement.class)
                .getResultList();
	}
}
