import urllib.request
import re
import os

url = "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/playstation-5/playstation-5.png"
try:
    urllib.request.urlretrieve(url, "public/ps5-new.png")
    print("Downloaded")
except Exception as e:
    print(e)
