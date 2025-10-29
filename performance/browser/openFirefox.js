addresses = [
  "index",
  "index+M3",
  "index+M3+pmacController",
  "index+IMG1",
  "index+IONP1",
  "index+PIRG1",
  "index+IONP2",
  "index+IMG11",
  "index+IONP11",
  "index+PIRG11",
  "index+IMG12",
  "index+IONP12",
  "index+PIRG12",
  "index+SPACE11",
  "index+MOD1",
  "index+MOD2",
]

for (var item of addresses) {
  window.open("http://localhost:4173/synoptic/B23/"+item, "_blank")
}
