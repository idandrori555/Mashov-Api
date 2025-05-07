FROM denoland/deno:alpine

WORKDIR /app

COPY . .

RUN deno install

EXPOSE 3000

CMD [ "deno task prod" ]