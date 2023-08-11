import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon_app");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key not null, uuid text, name text, price text, description text, image text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("select * from menuitems", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    tx.executeSql(`insert into menuitems (uuid, name, price, description, image, category) values ${menuItems
       .map((item) =>
         `("${item.id}", "${item.name}", "${item.price}", "${item.description}", "${item.image}", "${item.category}")`)
          	.join(', ')}`);
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  let includedCategory = "";
  activeCategories.forEach((item, idx) => {
    includedCategory = includedCategory + `'${item}'`;
    if (activeCategories.length - idx > 1) {
      includedCategory = includedCategory + ", ";
    }
  });
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from menuitems where name like '%${query}%' and category in (${includedCategory});`,
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        reject
      );
    });
  });
}
