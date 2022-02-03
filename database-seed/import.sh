#! /bin/bash

mongoimport --host database --db SolidaForm --collection users --type json --file ./db_collections/users.json --jsonArray
mongoimport --host database --db SolidaForm --collection products --type json --file ./db_collections/products.json --jsonArray
mongoimport --host database --db SolidaForm --collection userresponses --type json --file ./db_collections/userresponses.json --jsonArray
mongoimport --host database --db SolidaForm --collection tutorials --type json --file ./db_collections/tutorials.json --jsonArray
mongoimport --host database --db SolidaForm --collection questions --type json --file ./db_collections/questions.json --jsonArray