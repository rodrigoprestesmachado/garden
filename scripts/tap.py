import requests


class Tap:
    situation = False

    def getTapSituation(self, name):
        # api-endpoint
        URL = "http://code.inf.poa.ifrs.edu.br:8080/Garden/api/v1/isopen/" + "red"

        # defining a params dict for the parameters to be sent to the API
        PARAMS = {}

        # sending get request and saving the response as response object
        result = requests.get(url=URL, params=PARAMS)

        # extracting data in json format
        self.situation = result.json()["open"]

    def isOpen(self):
        self.getTapSituation("red")
        return self.situation


tap = Tap()
print(tap.isOpen())