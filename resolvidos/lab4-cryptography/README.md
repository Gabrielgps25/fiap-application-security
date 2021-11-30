# Lab 4 Parte 1 - Criptografia, Hash Functions, Assinatura Digital e Certificado Digital


## Criptografia Simétrica (AES 256)
1. Na pasta `aes`, crie um arquivo contendo um texto curto, para isso, na bash execute o comando: `echo "Segurança em Aplicações - MBA Mobile Development" >> text.txt`
2. Criptografe o arquivo usando: `openssl enc -aes-256-cbc -in text.txt -out text.txt.enc -k mySecretPassword`;
3. Desriptografe o arquivo usando: `openssl enc -d -aes-256-cbc -in text.txt.enc -out text.txt.dec -k mySecretPassword`;
4. Para validar a integridade do arquivo, compare as diferenças com: `diff text.txt text.txt.dec`, o output deve ser nulo;

## Criptografia Assimétrica (RSA com AES 128)

1. Na pasta `rsa`, crie um arquivo contendo um texto curto, para isso, na bash execute o comando: `echo "Segurança em Aplicações - MBA Mobile Development" >> text.txt`;
2. Crie uma chave privada rsa usando o comando: `openssl genrsa -aes128 -out private.pem 1024`;
3. Apartir da chave privada, extraia a chave pública, usando: `openssl rsa -in private.pem -outform PEM -pubout -out public.pem`;
4. Criptografe o arquivo apartir da chave pública com o comando: `openssl rsautl -encrypt -inkey public.pem -pubin -in text.txt -out text.enc`;
5. Descriptografe o arquivo apartir da chave privada com o comando: `openssl rsautl -decrypt -inkey private.pem -in text.enc`.

## Hash Functions

1. No bash execute `echo -n SeuNome | md5dsum`;
2. Busque o hash gerado no site: `https://www.md5online.org/md5-decrypt.html`;
3. Execute o mesmo comando usando os algoritmos `sha256sum` e `sha512sum`;
4. Quais diferenças encontramos ?

## Assinatura Digital

1. Na pasta `assinaturaDigital`, gere um par de chaves RSA conforme passo a passo acima.
2. Gere um checksum baseado no hash do conteúdo com o comando: `sha256sum text.txt | openssl rsautl -inkey private.pem -sign > text.checksum`;
3. Valide a assinatura via chave pública com o comando: `openssl rsautl -inkey public.pem -pubin -in text.checksum`.


## Certificado Digital

1. Na pasta `certificadoDigital`, gere uma chaves RSA e um novo certificado a partir do comando: `openssl req -nodes -new -x509 -keyout selfsigned.key -out selfsigned.crt`;
2. Guarde esse certificado para que possamos utilizar no futuro.
