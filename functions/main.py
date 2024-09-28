# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
import replicate
import base64
from io import BytesIO
import requests
from PIL import Image

@https_fn.on_call()
def sendingToReplicate(req: https_fn.CallableRequest):

    
    data = f"data:application/octet-stream;base64,{req.data}"
    input = {
        "image": data
        }
    #input = {    "image": "https://replicate.delivery/pbxt/JWsRA6DxCK24PlMYK5ENFYAFxJGUQTLr0JmLwsLb8uhv1JTU/shoe.jpg"}

    output = replicate.run(
        "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1", input=input)
    print(output)
    response = requests.get(output)
    img = Image.open(BytesIO(response.content))
    stuff = base64.b64encode(img.tobytes())
    print(stuff)
    return {"image" : stuff}
