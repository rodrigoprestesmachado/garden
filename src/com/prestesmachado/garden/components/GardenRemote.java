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

import javax.ejb.Remote;
import javax.ws.rs.PathParam;

/**
 * Garden API contract
 * 
 * @author Rodrigo Prestes Machado
 */
@Remote
public interface GardenRemote {
	
	public String sigin(@PathParam("name") String name, @PathParam("password") String password);
	
	public String changeTapSituation(@PathParam("name") String name, @PathParam("value") boolean value);
	
	public String isOpen(@PathParam("name") String name);
	
	public void sendEmail();
}