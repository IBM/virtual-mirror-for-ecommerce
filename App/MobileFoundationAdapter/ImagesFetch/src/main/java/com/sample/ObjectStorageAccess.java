package com.sample;

public class ObjectStorageAccess {
	public String baseUrl;
	public String authorizationHeader;

	public ObjectStorageAccess(String baseUrl, String authToken) {
		this.baseUrl = baseUrl;
		this.authorizationHeader = "Bearer " + authToken;
	}
}
