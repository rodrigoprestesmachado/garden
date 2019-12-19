import time
import sys
import RPi.GPIO as gpio

gpio.setmode(gpio.BOARD)
gpio.setup(32, gpio.OUT)

gpio.output(32, 1)
time.sleep(float(sys.argv[1]))
gpio.output(32, 0)
