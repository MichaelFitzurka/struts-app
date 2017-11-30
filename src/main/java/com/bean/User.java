package com.bean;

public class User {
	
	private String name;
	private String city;
	private String ssn;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	
	public String getSsn() {
		return ssn;
	}
	public void setSsn(String ssn) {
		this.ssn = ssn;
	}
	

	
	@Override
	public String toString() {
		return "User [name=" + name + ", city=" + city + ", ssn=" + ssn + "]";
	}

}
