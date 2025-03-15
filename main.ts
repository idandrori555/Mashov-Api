// Using Deno

import { Client } from "./client.ts";
import { userData } from "./config.ts";

const client = new Client(
  userData.semel,
  userData.year,
  userData.username,
  userData.password
);

await client.login();

console.log("1- print absences");
console.log("2- print grade average");
console.log("3- quit");

const option = parseInt(prompt("Enter choice:") ?? "3");

if (!isNaN(option)) {
  switch (option) {
    case 1:
      await client.printAbsences();
      break;
    case 2: {
      const avg = await client.getAverageGrades();
      console.log(`Average: ${avg.toFixed(2)}`);
      break;
    }
    case 3:
      console.log("Bye!");
      break;
    default:
      console.log("Invalid option");
      break;
  }
}
