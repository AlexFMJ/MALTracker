# original source https://gitlab.com/-/snippets/1992501
import secrets

                                                            # the -> is a function annotation. by itself it has no inherent function, but can be used in 3rd party code
                                                            # to describe a function and act on it. The -> indicates the return value type of this function
def get_new_code_verifier() -> str:                         # similar to c: type function_name();   in this case, function will return as type string
    token = secrets.token_urlsafe(100)
    return token[:128]


code_verifier = code_challenge = get_new_code_verifier()    # Equal because MAL only supports plain transformation method

print("length: {}".format(len(code_verifier)))
print(code_verifier)
