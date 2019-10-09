package com.prestesmachado.garden.ui;

import java.io.IOException;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.prestesmachado.garden.components.GardenRemote;

/**
 * Servlet implementation class WebInterface
 */
@WebServlet("/web")
public class WebInterface extends HttpServlet {
	private static final long serialVersionUID = 1L;
      
	@EJB
	private GardenRemote garden;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public WebInterface() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append(".").append(request.getContextPath());
	
		garden.sendEmail();
	
	}
	
	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
