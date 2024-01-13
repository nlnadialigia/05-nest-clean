openssl genpkey -algorithm RSA -out private_key.pem && \
base64 -w 0 private_key.pem > private_key_base64.txt && \
openssl rsa -pubout -in private_key.pem -out public_key.pem && \
base64 -w 0 public_key.pem > public_key_base64.txt