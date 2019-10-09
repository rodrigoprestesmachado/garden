package com.prestesmachado.garden.components;

import java.util.logging.Logger;

import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.MessageListener;

/**
 * Message-Driven Bean implementation class for: EmailService
 */
@MessageDriven(activationConfig = {
	    @ActivationConfigProperty(propertyName = "destinationLookup",
	            propertyValue = "java:/jms/queue/ExpiryQueue"),
	    @ActivationConfigProperty(propertyName = "destinationType",
	            propertyValue = "javax.jms.Queue")
	})
public class EmailMDB implements MessageListener {

	private static final Logger log = Logger.getLogger(EmailMDB.class.getName());
	
    /**
     * Default constructor. 
     */
    public EmailMDB() {
        // TODO Auto-generated constructor stub
    }
	
	/**
     * @see MessageListener#onMessage(Message)
     */
    public void onMessage(Message jmsMessage) {
        
    	try {
    		MapMessage map = (MapMessage) jmsMessage;
			log.info("Message received: " + map.getString("test"));
		} catch (JMSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
    }

}
