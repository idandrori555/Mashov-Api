# Simple Fetch Based Mashov API

## Installation
```bash
git clone https://github.com/idandrori555/Mashov-Api.git
```

```
Get your school semel at https://web.mashov.info/api/schools
```

## Example
```js
import { Client } from "./client.ts";
import { userData } from "./config.ts"; // change the configuration.

const client = new Client(
  userData.semel,
  userData.year,
  userData.username,
  userData.password
);

// Login the client
await client.login(); 
```

This project is scalable and open source. edit the ```client.ts``` file to add features.
