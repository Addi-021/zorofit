from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

h = hash_password("test12345")
print(verify_password("test12345", h))
print(verify_password("wrong", h))

t = create_access_token(1)
print(decode_access_token(t))
