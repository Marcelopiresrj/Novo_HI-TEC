import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    "https://api.github.com/search/code?q=ps5+extension:png",
    headers={'User-Agent': 'Mozilla/5.0'}
)

try:
    response = urllib.request.urlopen(req, context=ctx)
    data = json.loads(response.read().decode('utf-8'))
    for item in data.get('items', [])[:5]:
        print(item['html_url'])
except Exception as e:
    print(e)
