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
const propertiesReader: any = require("properties-reader");
const https: any = require("https");
const axios: any = require("axios");
const shell: any = require("shelljs");
const nodemailer: any = require("nodemailer");

/**
 * GardenWeather class. Verifies the weather, sets the Garden service and
 * comunicates the result through gmail and telegram
 *
 * @author Rodrigo Prestes Machado
 */
class GardenWeather {
  // Open Weather service configuration
  private WEATHER_WS: string;
  private WEATHER_POA: string;
  private WEATHER_KEY: string;

  // Garden service
  private GARDEN_WS: string;

  // Gmail configuration
  private GMAIL: string;
  private GMAIL_PASS: string;

  // Telegram configuration
  private TELEGRAM_PHONE: string;
  private TELEGRAM_PATH: string;

  // Properties file
  private properties: any;

  constructor() {
    // Gets all configuration from a propertie file
    this.properties = propertiesReader("properties.file");

    this.WEATHER_WS = this.properties.get("weather.ws");
    this.WEATHER_POA = this.properties.get("weather.poa");
    this.WEATHER_KEY = this.properties.get("weather.key");

    this.GARDEN_WS = this.properties.get("garden.ws");

    this.GMAIL = this.properties.get("gmail.email");
    this.GMAIL_PASS = this.properties.get("gmail.password");

    this.TELEGRAM_PHONE = this.properties.get("telegram.phone");
    this.TELEGRAM_PATH = this.properties.get("telegram.path");
  }

  /**
   * Gets the weather conditions, sets the Garden WS and send Telegram message
   * @param setGardenWS true if want to set the Garden WS
   * @param sendEmail true if want to send an gmail message
   * @param sendTelegramMessage true if want to send a Telegram message
   */
  public getWeather(
    setGardenWS: boolean,
    sendEmail: boolean,
    sendTelegramMessage: boolean
  ) {
    https
      .get(this.WEATHER_WS + this.WEATHER_POA + "&APPID=" + this.WEATHER_KEY, resp => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });

        // The whole response has been received.
        resp.on("end", () => {
          // Reads data from weather service
          let conditions = JSON.parse(data);
          // checks if will rain tomorrow
          let rainWarning = this.verifyConditions(conditions);
          // creates the weather object
          let weather = this.createWeather(rainWarning);
          // set the condition to Garden service
          console.log("[INFO] GardenWeather: setGardenWS = " + setGardenWS);
          setGardenWS === true ? this.setGardenWS(weather.action, "red") : "";
          // Sends an e-mail message
          console.log("[INFO] GardenWeather: sendEmail = " + sendEmail);
          sendEmail === true ? this.sendEmail(weather.text) : "";
          // Sends telegram message
          console.log(
            "[INFO] GardenWeather: sendTelegramMessage = " + sendTelegramMessage
          );
          sendTelegramMessage === true
            ? this.sendTelegramMessage(weather.text, "Automation")
            : "";
        });
      })

      .on("error", err => {
        console.log("[ERROR] GardenWeather: " + err.message);
      });
  }

  /**
   * Returns the tomorrow date
   */
  private getTomorrow() {
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toJSON().substring(0, 10);
  }

  /**
   * Creates a Weather object
   *
   * @param rainWarnings
   */
  private createWeather(rainWarnings: any) {
    let weather = new Weather();

    if (rainWarnings.length > 0) {
      weather.warnings = rainWarnings;
      weather.text = "Irá chover amanhã";
      weather.action = false;
    } else {
      weather.text = "Sem chuva prevista para amanhã";
      weather.action = true;
    }
    return weather;
  }

  /**
   * Verifies the Weather condition
   * @param conditions
   */
  private verifyConditions(conditions: any) {
    let rainWarnings = [];

    let rainCodes = this.wsCodes();
    let strTomorrow = this.getTomorrow();

    for (const key in conditions.list) {
      //gets only tomorrow dates
      if (strTomorrow == conditions.list[key].dt_txt.substring(0, 10)) {
        // tests if will rain
        for (const key in rainCodes) {
          if (rainCodes[key].code == conditions.list[key].weather[0].id) {
            rainWarnings.push({
              name: rainCodes[key].name,
              code: rainCodes[key].code,
              time: conditions.list[key].dt_txt
            });
          }
        }
      }
    }
    return rainWarnings;
  }

  /**
   * Sets the Garden WS status
   * @param open
   */
  private setGardenWS(operation: boolean, tap: string) {
    let serviceUrl = this.GARDEN_WS + tap + "/" + operation + "/" + this.WEATHER_KEY;
    console.log("[INFO] Service URL: " + serviceUrl)
    axios
      .get(serviceUrl)
      .then(response => {
        console.log(
          "[INFO] GardenWeather: response.data.url " + response.data.url
        );
        console.log(
          "[INFO] GardenWeather: response.data.explanation " +
          response.data.explanation
        );
      })
      .catch(error => {
        console.log("[ERROR] GardenWeather: " + error);
      });
  }

  /**
   * Sends a message to a Telegram client
   * @param message
   */
  private sendTelegramMessage(message: string, to: string) {
    const command =
      this.TELEGRAM_PATH +
      "telegram-cli -W --phone " +
      this.TELEGRAM_PHONE +
      ' -e "msg ' +
      to +
      " " +
      message +
      '"';
    console.log("[INFO] GardenWeather: telegram command - " + command);
    shell.exec(command);
  }

  /**
   * Sends an e-mail message using gmail
   * @param message
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
      subject: "Previsão do tempo",
      text: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("[ERROR] GardenWeather: " + error);
      } else {
        console.log("[INFO] GardenWeather: e-mail sent - " + info.response);
      }
    });
  }

  /**
   * Returns the Open Weather codes
   */
  private wsCodes() {
    return [
      {
        name: "light rain",
        code: 500
      },
      {
        name: "moderate rain",
        code: 501
      },
      {
        name: "heavy intensity rain",
        code: 502
      },
      {
        name: "very heavy rain",
        code: 503
      },
      {
        name: "extreme rain",
        code: 504
      }
    ];
  }
}

/**
 * Encapsulete the Weather conditions
 */
class Weather {
  text: string;
  warnings: any;
  action: boolean;
}

let g = new GardenWeather();
g.getWeather(true, true, false);
