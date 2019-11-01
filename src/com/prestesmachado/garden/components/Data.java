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

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import com.prestesmachado.garden.model.Tap;
import com.prestesmachado.garden.model.User;

/**
 * Implements a JPA API for data access
 * 
 * @author Rodrigo Prestes Machado
 * @version 0.0.1
 */
@Stateless
public class Data {

	@PersistenceContext(unitName = "Garden")
	private EntityManager em;

	/**
	 * Return the tap object
	 * 
	 * @param String name : The name of the tap
	 * @return Tap tap: The tap object
	 */
	public Tap findTap(String name) {
		try {
			CriteriaBuilder builder = em.getCriteriaBuilder();

			CriteriaQuery<Tap> criteria = builder.createQuery(Tap.class);
			Root<Tap> root = criteria.from(Tap.class);
			criteria.select(root);
			criteria.where(builder.like(root.get("name"), name + "%"));

			return em.createQuery(criteria).getSingleResult();
		} catch (NoResultException e) {
			return null;
		}
	}

	/**
	 * Return the user object
	 * 
	 * @param String email : The email of the user
	 * @return User user: The user object
	 */
	public User findUser(String email, String password) {
		try {
			CriteriaBuilder builder = em.getCriteriaBuilder();

			CriteriaQuery<User> criteria = builder.createQuery(User.class);
			Root<User> root = criteria.from(User.class);
			criteria.select(root);
			criteria.where(builder.like(root.get("email"), email));
			return em.createQuery(criteria).getSingleResult();
		} catch (NoResultException e) {
			return null;
		}
	}

	/**
	 * Persist the state of a tap
	 * 
	 * @param Tap tap : A tap object
	 */
	public void persistTap(Tap tap) {
		em.merge(tap);
	}

}