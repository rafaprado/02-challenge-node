import { app } from "./app";

app.listen({
  port: 3333
})
.then(() => {
  console.log("LISTENING ON PORT 3333");
})