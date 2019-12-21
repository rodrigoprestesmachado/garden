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
package com.prestesmachado.garden.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Tap {
	
	@Id
	@GeneratedValue
	@JsonIgnore
	private long id;
	
	private String name;
	
	private boolean situation;
	
	private byte pin;
	
	@JsonIgnore
	private String tapKey;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isSituation() {
		return situation;
	}

	public void setSituation(boolean situation) {
		this.situation = situation;
	}

	public String getTapKey() {
		return tapKey;
	}

	public void setTapKey(String tapKey) {
		this.tapKey = tapKey;
	}

	public byte getPin() {
		return pin;
	}

	public void setPin(byte pin) {
		this.pin = pin;
	}
	
}