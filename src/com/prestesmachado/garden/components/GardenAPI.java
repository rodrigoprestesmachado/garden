/**
 * @license
 * 
 * Copyright 2019 Rodrigo Prestes Machado
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.prestesmachado.garden.components;

import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.jms.ConnectionFactory;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.JMSProducer;
import javax.jms.MapMessage;
import javax.jms.Queue;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.prestesmachado.garden.model.Tap;
import com.prestesmachado.garden.model.User;

/**
 * Session Bean implementation for garden api
 * 
 * @author Rodrigo Prestes Machado
 */
@Path("/v1")
@Stateless
public class GardenAPI implements GardenRemote {
	
	private Data dao;
	
	@Context
	private HttpServletRequest request;
	
	private static final Logger log = Logger.getLogger(GardenAPI.class.getName());
	
	
    public GardenAPI() {	
    	try {
    		InitialContext context = new InitialContext();
			dao = (Data) context.lookup("java:global/Garden/Data");
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

    @GET
   	@Produces(MediaType.APPLICATION_JSON)
   	@Path("/sigin/{email}/{password}")
   	public String sigin(@PathParam("email") String email, @PathParam("password") String password) {
       	
    	log.info("Sigin method");
       	
       	User user = dao.findUser(email, password);
        
    	StringBuilder json = new StringBuilder();
    	if (user != null) {
    		json.append("{\"sigin\":\"true\"}");
    	}
    	else
    		json.append("{\"sigin\":\"false\"}");
    	
    	return json.toString();
    }
    
    @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/open/{name}/{value}")
    @Override
	public String changeTapSituation(@PathParam("name") String name, @PathParam("value") boolean value) {
    	
    	log.info("Open method");
    	
    	Tap tap = dao.findTap(name);
  
    	StringBuilder json = new StringBuilder();
    	if (tap != null) {
    		tap.setSituation(value);
    		dao.persistTap(tap);
    		json.append("{\"open\":\""+ tap.isSituation() +"\"}");
    	}
    	else
    		json.append("{\"open\":\"none\"}");
    	
    	return json.toString();
    }
    
    
    @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/isopen/{name}")
    @Override
	public String isOpen(@PathParam("name") String name) {
    	
    	log.info("Open method");
    	
    	Tap tap = dao.findTap(name);
  
    	StringBuilder json = new StringBuilder();
    	if (tap != null)
    		json.append("{\"open\":\""+ tap.isSituation() +"\"}");
    	else
    		json.append("{\"open\":\"none\"}");
    	
    	return json.toString();
    }
    

	@Override
	public void sendEmail() {
		
		InitialContext ic;
		try {
			ic = new InitialContext();
			ConnectionFactory connectionFactory = (ConnectionFactory) ic.lookup("java:jboss/DefaultJMSConnectionFactory");
			Queue queue = (Queue) ic.lookup("java:/jms/queue/ExpiryQueue");
			
			JMSContext jmsContext = connectionFactory.createContext();
			JMSProducer producer = jmsContext.createProducer();
			
			MapMessage map = jmsContext.createMapMessage();
			map.setString("test", "Test value");
			
			producer.send(queue, map);
			
		} catch (NamingException | JMSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}