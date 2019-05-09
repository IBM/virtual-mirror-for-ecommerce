/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015, 2016. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package com.sample;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.ibm.mfp.adapter.api.AdaptersAPI;

@OAuthSecurity(enabled=false)
@Api(value = "Sample Adapter Resource")
@Path("/resource")
public class ImagesFetchResource {
	/*
	 * For more info on JAX-RS see
	 * https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	// Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(ImagesFetchResource.class.getName());

	// Inject the MFP configuration API:
	@Context
	ConfigurationAPI configApi;

	@Context
	AdaptersAPI adaptersAPI;

	@GET
	@Path("/objectStorage")
	@Produces("application/json")
	public Response getObjectStorageAccess() throws Exception {
		ImagesFetchApplication app = adaptersAPI.getJaxRsApplication(ImagesFetchApplication.class);
		return Response.ok(app.getObjectStorageAccess()).build();
	}

	@GET
	@Path("/recommendationEngine")
	@Produces("application/json")
	public Response getRecommendationEngineAccess() throws Exception {
		ImagesFetchApplication app = adaptersAPI.getJaxRsApplication(ImagesFetchApplication.class);
		return Response.ok(app.getRecommendationEngineAccess()).build();
	}

	@GET
	@Path("/visualRecognition")
	@Produces("application/json")
	public Response getVisualRecognitionAccess() throws Exception {
		ImagesFetchApplication app = adaptersAPI.getJaxRsApplication(ImagesFetchApplication.class);
		return Response.ok(app.getVisualRecognitionAccess()).build();
	}

	@GET
	@Path("/virtualMirror")
	@Produces("application/json")
	public Response getVirtualMirrorAccess() throws Exception {
		ImagesFetchApplication app = adaptersAPI.getJaxRsApplication(ImagesFetchApplication.class);
		return Response.ok(app.getVirtualMirrorAccess()).build();
	}


}
