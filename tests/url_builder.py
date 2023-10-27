# look into requests_oauth module
import requests     # third party lib, install with: pip install requests
import logging      # log all errors
from oauthlib.oauth2 import WebApplicationClient
import secrets


logging.captureWarnings(True)


# create function to generate code verifier
def get_new_code_verifier() -> str:
    token = secrets.token_urlsafe(100)
    return token[:128]


auth_server_url = 'https://myanimelist.net/v1/oauth2/authorize'
token_server_url = 'https://myanimelist.net/v1/oauth2/token'

response_type = 'code'
client_id = 'f0d607de3f9a4b4302d360befdaacc38'
client_secret = 'a7e476a26603946f26553b1cbd0dbf53f4e898def49c3aa1076b009962423961'
code_verifier = code_challenge = get_new_code_verifier()    # Equal because MAL only supports plain transformation method
state = 'OauthTest'

user_auth_payload = {'response_type': response_type, 'client_id': client_id, 'client_secret': client_secret, 'code_challenge' : code_challenge, 'state':state}

s = requests.Session()

# def pretty_print_POST(req):
#     """
#     At this point it is completely built and ready
#     to be fired; it is "prepared".

#     However pay attention at the formatting used in 
#     this function because it is programmed to be pretty 
#     printed and may differ from the actual request.
#     """
#     print('{}\n{}\r\n{}\r\n\r\n{}'.format(
#         '-----------START-----------',
#         req.method + ' ' + req.url,
#         '\r\n'.join('{}: {}'.format(k, v) for k, v in req.headers.items()),
#         req.body,
#     ))

def user_authorization():
    # base URL: https://myanimelist.net/v1/oauth2/authorize (GET request)
    # r = requests.Request('GET', auth_server_url, params=payload)
    # prepared = r.prepare()
    # pretty_print_POST(prepared)
    r = requests.get(auth_server_url, params=user_auth_payload)

    print(r)

def get_new_token():
    token_req_payload = {'client_id':client_id, 'client_secret':client_secret, 'code':auth_code, 'code_verifier':code_verifier, 'grant_type':'authorization_code'}

    token_response = requests.post(auth_server_url, params=token_req_payload)

# send the authorization request
user_authorization()

# verifiy the response state and save the auth_code to a variable


get_new_token()
print("done")
