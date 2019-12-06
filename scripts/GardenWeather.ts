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
const https: any = require("https");
const axios: any = require("axios");
const shell: any = require("shelljs");

/**
 * @author Rodrigo Prestes Machado
 */
class GardenWeather {
  // Open Weather service
  private WEATHER_WS: string;
  private POA: string;
  private KEY: string;

  // Telegram
  private TELEGRAM_PHONE: string;
  private TELEGRAM_PATH: string;

  // Garden service
  private GARDEN_WS: string;

  constructor() {
    this.WEATHER_WS = "https://api.openweathermap.org/data/2.5/forecast?id=";
    this.POA = "3452925";
    this.KEY = "your key";

    this.TELEGRAM_PHONE = "yout phne";
    this.TELEGRAM_PATH = " your telegram cli path";

    this.GARDEN_WS = "http://code.inf.poa.ifrs.edu.br/Garden/api/v1/open/";
  }

  /**
   * Gets the weather conditions, sets the Garden WS and send Telegram message
   * @param setGardenWS true if want to set the Garden WS
   * @param sendTelegramMessage true if want to send a Telegram message
   */
  public getWeather(setGardenWS: boolean, sendTelegramMessage: boolean) {
    https
      .get(this.WEATHER_WS + this.POA + "&APPID=" + this.KEY, resp => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          let conditions = JSON.parse(data);

          let rainWarning = this.verifyConditions(conditions);

          let weather = this.createWeather(rainWarning);

          setGardenWS == true ? this.setGardenWS(weather.action, "red") : "";
          sendTelegramMessage == true
            ? this.sendTelegramMessage(weather.text, "Automation")
            : "";
        });
      })

      .on("error", err => {
        console.log("Error: " + err.message);
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
  private setGardenWS(open: boolean, tap: string) {
    axios
      .get(this.GARDEN_WS + tap + "/" + open)
      .then(response => {
        console.log(response.data.url);
        console.log(response.data.explanation);
      })
      .catch(error => {
        console.log(error);
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
    console.log("Telegram command: " + command);
    shell.exec(command);
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
g.getWeather(true, true);
