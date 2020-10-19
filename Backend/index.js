const Logger = require("./debugging-tools/Logger");
const Database = require("./database/Database");
const express = require("express");

const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");

const app = express();

app.disable("etag");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});

app.use(express.json());

app.use("/api", apiRouter);
app.use("/auth", authRouter);

app.use(express.static(__dirname + "/assets"));

const db = new Database();

const initialize = async () => {
  try {
    await db.dropAll();

    if (await db.doAllTablesExist()) {
      console.log("Everything is ready");
    } else {
      await db.createAll();
      console.log("Tables were created");
    }

    if (await db.doesUserExist('admin@admin.com')) {
      console.log("Admin exist");
    } else {
      await db.createAdmin();
    }

    await db.insert('Categories', ['Shirts']);
    await db.insert('Categories', ['T-Shirts']);
    await db.insert('Categories', ['Tank Tops']);
    await db.insert('Categories', ['Sweatshirts']);
    await db.insert('Categories', ['Sweater']);
    await db.insert('Categories', ['Coats']);
    await db.insert('Categories', ['Jacket']);
    await db.insert('Categories', ['Jeans']);

    /*await db.insert('Items', [1, 'Black Shirt  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget velit nisi. Nunc malesuada ut velit ut tincidunt. Mauris ultricies in sem id varius. Nam finibus sapien eget nulla eleifend pharetra.', 15, 'man', 'L', 'Stuff', 'US Polo', 'Black', 21.99]);
    await db.insert('Items', [1, 'Blue Shirt', 15, 'man', 'L', 'Stuff', 'US Polo', 'Black', 21.99]);
    await db.insert('Items', [1, 'Summer Shirt', 15, 'man', 'L', 'Stuff', 'zara', 'Black', 21.99]);
    await db.insert('Items', [1, 'Winter Shirt', 15, 'man', 'L', 'Stuff', 'h&mo', 'Black', 21.99]);
    await db.insert('Items', [1, 'Spring Shirt', 15, 'man', 'L', 'Stuff', 'zara', 'Black', 21.99]);
    await db.insert('Items', [1, 'Colorful Shirt', 15, 'man', 'L', 'Stuff', 'US Polo', 'Black', 21.99]);*/
    db.insert('Items', [1, 'Black Casual Shirt US Polo', 15, { gender: 'man', size: 'L,M', material: 'silk', brand: 'us polo', color: 'Black' }, 101.99]);
    db.insert('Items', [1, 'Red Plaid Winter Shirt TEODOR', 10, { gender: 'man', size: 'L,M', material: 'cutton', brand: 'teodor', color: 'Black' }, 21.99]);
    db.insert('Items', [1, 'White Spring Shirt H&M', 55, { gender: 'man', size: 'L,M', material: 'polyester', brand: 'h&m', color: 'Black' }, 11.99]);
    db.insert('Items', [1, 'White Spring Shirt ZARA Premium', 85, { gender: 'man', size: 'L,S', material: 'spandex', brand: 'zara', color: 'Black' }, 89.99]);
    db.insert('Items', [1, 'Black Sport Shirt LC Waikiki', 85, { gender: 'man', size: 'L,XS', material: 'polyester', brand: 'lc waikiki', color: 'Black' }, 89.99]);
    db.insert('Items', [1, 'Red Plaid Casual Shirt Lee Cooper', 85, { gender: 'man', size: 'L', material: 'tweed', brand: 'zara', color: 'Black' }, 89.99]);
    //db.selectNew('firstname').from("Users").where({ email: 'admin@admin.com' }).send();
    const r = await db.select("description ->> 'size'").as('sizes').distinct().from("Items").send();
    //db.selectNew('firstname').from("Users").where({ email: 'admin@admin.com' }).send();
    console.log(r);
  } catch (e) {
    throw e;
  }
};

initialize()
  .then((res) => {
    //console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log(Logger.now() + ` Listening on port ${port}...`)
);
