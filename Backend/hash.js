import bcrypt from "bcrypt";

const hash = "$2b$10$Xs891LrLTVFUy3l8hcSIzOMyKdcOpaaHj/cw9RSXgU5ZDkqm.ZVZG";
const candidates = ["admin123", "password", "123456", "megha123","Chinnima@8050"];

for (const p of candidates) {
  console.log(p, "=>", await bcrypt.compare(p, hash));
}
