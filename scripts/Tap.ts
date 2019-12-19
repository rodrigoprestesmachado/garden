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
var gpiop = require('rpi-gpio').promise;
const axios: any = require("axios");

class Tap {

    // Garden service
    private GARDEN_WS: string;

    constructor() {
        this.GARDEN_WS = "http://code.inf.poa.ifrs.edu.br/Garden/api/v1/";
    }

    /**
     * Opens the tap to wet the garden
     * 
     * @param tapName : the tap name
     * @param wetTime : duration of wet in miliseconds
     */
    public wet(tapName: string, wetTime: number) {
        axios
            .get(this.GARDEN_WS + "/isopen/" + tapName)
            .then(response => {
                if (response.data.open === "true") {
                    this.goWet(wetTime);
                    console.log("[INFO] Molhando grama: " + new Date());
                }
            })
            .catch(error => {
                console.log("[ERROR] " + error);
            });
    }

    /**
     * Enables the GPIO
     * 
     * @param wetTime : duration of wet in miliseconds
     */
    private goWet(wetTime: number) {
        // Pin 32 of GPIO
        gpiop.setup(32, gpiop.DIR_OUT)
            .then(() => {
                gpiop.write(32, true);
                setTimeout(() => {
                    gpiop.write(32, false);
                    console.log("[INFO] Grama molhada: " + new Date());
                }, wetTime);
            })
            .catch((err) => {
                console.log('Error: ', err.toString())
            })
    }
}

// Red tap can open for 45 min
new Tap().wet("red", 2.7e+6);