/**
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
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 * Session Bean implementation class Garden
 * 
 * @author Rodrigo Prestes Machado
 */
@Path("/api")
@Stateless
public class Garden implements GardenRemote {
	
	@Context
	private HttpServletRequest request;
	

    public Garden() { }

    @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/open")
    @Override
	public boolean open() {
		return false;
	}
	
    @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/close")
    @Override
	public boolean close() {
		return false;
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