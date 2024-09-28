# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app
import replicate


input = {
    "image": "https://replicate.delivery/pbxt/JWsRA6DxCK24PlMYK5ENFYAFxJGUQTLr0JmLwsLb8uhv1JTU/shoe.jpg"
}

output = replicate.run(
    "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
    input=input
)
print(output)
# initialize_app()
#
#
# @https_fn.on_request()
# def on_request_example(req: https_fn.Request) -> https_fn.Response:
#     return https_fn.Response("Hello world!")