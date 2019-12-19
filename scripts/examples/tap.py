import requests


class Tap:
    situation = False

    def getTapSituation(self, name):
        # api-endpoint
        URL = "http://code.inf.poa.ifrs.edu.br/Garden/api/v1/isopen/" + name

        # defining a params dict for the parameters to be sent to the API
        PARAMS = {}

        # sending get request and saving the response as response object
        result = requests.get(url=URL, params=PARAMS)

        # extracting data in json format
        self.situation = result.json()["open"]

    def wet(self, tapName, duration):
        self.getTapSituation(tapName)
        if (self.situation == "true"):
            print("true")

        return self.situation


tap = Tap()
print(tap.wet("red", 60.0))
