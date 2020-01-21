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
const nodemailer: any = require("nodemailer");
const propertiesReader: any = require("properties-reader");

class Tap {

    // Garden service
    private GARDEN_WS: string;

    // Gmail configuration
    private GMAIL: string;
    private GMAIL_PASS: string;

    // Defaul pin
    private DEFAUL_PIN: any;

    // Properties file
    private properties: any;

    constructor() {
        // Gets all configuration from a propertie file
        this.properties = propertiesReader("properties.file");

        this.GARDEN_WS = this.properties.get("garden.ws");

        this.GMAIL = this.properties.get("gmail.email");
        this.GMAIL_PASS = this.properties.get("gmail.password");

        this.DEFAUL_PIN = 32;
    }

    /**
     * Opens the tap to wet the garden
     * 
     * @param tapName : the tap name
     */
    public open(tapName: string) {
        let wettingTime = 0;
        axios
            .get(this.GARDEN_WS + "/isopen/" + tapName)
            .then(resp => {
                if (resp.data.situation === true)
                    // 40 minuts
                    wettingTime = 2.4e+6;
                else
                    // 15 minuts
                    wettingTime = 900000;

                console.log("[INFO] Molhando grama: " + new Date());
                this.powerUpGpio(resp.data.pin, wettingTime);
            })
            .catch(error => {
                console.log("[ERROR] " + error);
                // Default wet time 30 minuts
                wettingTime = 1.8e+6;
                this.powerUpGpio(this.DEFAUL_PIN, wettingTime);
            });
    }

    /**
     * Enables the GPIO to wet the garden
     * 
     * @param wettingTime : The duration of wet in miliseconds
     */
    private powerUpGpio(pin: number, wettingTime: number) {
        // Pin 32 of GPIO
        gpiop.setup(pin, gpiop.DIR_OUT)
            .then(() => {
                // Opens the tap
                gpiop.write(pin, true);
                // Waits to close
                setTimeout(() => {
                    // Close the tap
                    gpiop.write(pin, false);
                    this.sendEmail("The tap was opene for " + wettingTime + " miliseconds");
                    console.log("[INFO] The garden was wet: " + new Date());
                }, wettingTime);
            })
            .catch((err) => {
                console.log('[ERROR] ', err.toString())
            })
    }

    /**
     * Sends an e-mail message through gmail
     * 
     * @param message : The e-mail content
     */
    private sendEmail(message: string) {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.GMAIL,
                pass: this.GMAIL_PASS
            }
        });

        let mailOptions = {
            from: this.GMAIL,
            to: this.GMAIL,
            subject: "[Garden] Tap",
            text: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("[ERROR] gmail: " + error);
            } else {
                console.log("[INFO] e-mail sent:" + info.response);
            }
        });
    }
}

// Opens one tap
new Tap().open("red");