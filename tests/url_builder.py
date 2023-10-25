# look into requests_oauth module
import requests     # third party lib, install with: pip install requests


# base URL: https://myanimelist.net/v1/oauth2/authorize (GET request)
r = requests.get('https://myanimelist.net/v1/oauth2/authorize')

# Parameter response_type: must be set to "code". (REQUIRED)

# Parameter client_id: your Client ID. (REQUIRED)

# Parameter code_challenge: the Code Challenge generated during the previous step. (REQUIRED)

# Parameter state: a string which can be used to maintain state between the request and callback. It is later returned by the MAL servers to the API client. (RECOMMENDED)

# Parameter redirect_uri: the URL to which the user must be redirected after the authentication. (OPTIONAL)
