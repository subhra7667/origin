package com.wipro.devops.beans;

import java.sql.Date;

import javax.json.JsonObjectBuilder;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
@Entity
@Table(name ="XXCUST_PROJ_MGMT")
@NamedQueries({@NamedQuery(name = "Projectmanagement.findAllByUID", query = "SELECT t FROM Projectmanagement p WHERE p.createdBy.id = :uid"),
    @NamedQuery(name = "Projectmanagement.findAllByPID",
                query = "SELECT p FROM Projectmanagement p where p.projectId.project_id = :pId"),
    @NamedQuery(name = "Projectmanagement.findAll",
                query = "SELECT p FROM Projectmanagement p")
})
public class Projectmanagement extends AbstractEntity{
	@Id
    @Column(name = "PGMT_ID")
	private String pgmtId;
	@Column(name ="USER_NAME")
	private String userName;
	@Column(name ="PASSWORD")
	private String password;
	@Column(name ="TOOL_NAME")
	private String toolName;
	@Column(name ="PROTOCOL_TYPE")
	private String protocolType;
	@Column(name ="URL")
	private String url;
	@Column(name ="CREATED_BY")
	private User createdBy;
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name ="CREATION_DATE")

	private Date creationDate;
	@Column(name ="LAST_UPDATED_BY")
	private String lastUpdatedBy;
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "LAST_UPDATED_DATE")
	private Date lastUpdatedDate;
	@ManyToOne
    @JoinColumn(name = "PROJECT_ID")
    private Project projectId;
	
	
	public Projectmanagement()
	{
		
	}

	
	public Projectmanagement(String pgmtId, String userName, String password, String toolName, String protocolType,
			String url, User createdBy, Date creationDate, String lastUpdatedBy, Date lastUpdatedDate,
			Project projectId) {
		super();
		this.pgmtId = pgmtId;
		this.userName = userName;
		this.password = password;
		this.toolName = toolName;
		this.protocolType = protocolType;
		this.url = url;
		this.createdBy = createdBy;
		this.creationDate = creationDate;
		this.lastUpdatedBy = lastUpdatedBy;
		this.lastUpdatedDate = lastUpdatedDate;
		this.projectId = projectId;
	}


	public String getPgmtId() {
		return pgmtId;
	}


	public void setPgmtId(String pgmtId) {
		this.pgmtId = pgmtId;
	}


	public String getUserName() {
		return userName;
	}


	public void setUserName(String userName) {
		this.userName = userName;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getToolName() {
		return toolName;
	}


	public void setToolName(String toolName) {
		this.toolName = toolName;
	}


	public String getProtocolType() {
		return protocolType;
	}


	public void setProtocolType(String protocolType) {
		this.protocolType = protocolType;
	}


	public String getUrl() {
		return url;
	}


	public void setUrl(String url) {
		this.url = url;
	}


	public User getCreatedBy() {
		return createdBy;
	}


	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}


	public Date getCreationDate() {
		return creationDate;
	}


	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}


	public String getLastUpdatedBy() {
		return lastUpdatedBy;
	}


	public void setLastUpdatedBy(String lastUpdatedBy) {
		this.lastUpdatedBy = lastUpdatedBy;
	}


	public Date getLastUpdatedDate() {
		return lastUpdatedDate;
	}


	public void setLastUpdatedDate(Date lastUpdatedDate) {
		this.lastUpdatedDate = lastUpdatedDate;
	}


	public Project getProjectId() {
		return projectId;
	}


	public void setProjectId(Project projectId) {
		this.projectId = projectId;
	}


	@Override
	public void addJson(JsonObjectBuilder builder) {
		// TODO Auto-generated method stub
		builder.add("pgmt_id",pgmtId );
		builder.add("project_id",projectId.getProject_id());
		builder.add("project_id",projectId.getProject_name() );
		builder.add("user_name",userName );
		builder.add("password",password );
		builder.add("tool_name",toolName);
		builder.add("protocol_type",protocolType );
		builder.add("url", url);
		//builder.add("created_by",createdBy );
		builder.add("created_by", createdBy.getUsername());
		builder.add("creation_date",creationDate.toString() );
		builder.add("last_updated_by",lastUpdatedBy );
		builder.add("last_updated_date",lastUpdatedDate.toString() );
		
		
	}

}
