import { products as trendyolProductsList } from "./trendyolProductsList.js";
import { products as hepsiburadaProductsList } from "./hepsiburadaProductsList.js";
import { products as amazonProductsList } from "./amazonProductsList.js";
let categories = [];

for(let {category} of trendyolProductsList){
    categories.push(category);
}for(let {category} of amazonProductsList){
    categories.push(category);
}for(let {category} of hepsiburadaProductsList){
    categories.push(category);
}

categories = [... new Set(categories)].sort();
export {categories};
