"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const RecipeDao = require("../dao/recipe-dao");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "ingredients.json");

class IngredientDao {
  constructor(storagePath) {
    this.ingredientStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async createIngredient(ingredient) {
    let ingredientlist = await this._loadAllIngredients();
    ingredient.id = "ING-" + crypto.randomBytes(4).toString("hex");
    ingredientlist.push(ingredient);
    await wf(this._getStorageLocation(), JSON.stringify(ingredientlist, null, 2));
    return ingredient;
  }

  async getIngredient(id) {
    let ingredientlist = await this._loadAllIngredients();
    const result = ingredientlist.find((b) => b.id === id);
    return result;
  }

  async updateIngredient(ingredient) {
    let ingredientlist = await this._loadAllIngredients();
    const ingredientIndex = ingredientlist.findIndex((b) => b.id === ingredient.id);
    if (ingredientIndex < 0) {
      throw new Error(`Ingredient with given id ${ingredient.id} does not exists.`);
    } else {
      ingredientlist[ingredientIndex] = {
        ...ingredientlist[ingredientIndex],
        ...ingredient,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(ingredientlist, null, 2));
    return ingredientlist[ingredientIndex];
  }

  async deleteIngredient(id) {
    let ingredientlist = await this._loadAllIngredients();
    const ingredientIndex = ingredientlist.findIndex((b) => b.id === id);
    if (ingredientIndex >= 0) {
      let recipeD=await new RecipeDao(path.join("storage", "recipes.json"));
      let countOfUse=await recipeD.getCountOfRecipiesByIngredient(id);
      if(countOfUse>0){    
        throw new Error("Ingredient id "+id+" is used in "+countOfUse+" recipients. Delete is not possible.");
      }else{
        ingredientlist.splice(ingredientIndex, 1);
        await wf(this._getStorageLocation(), JSON.stringify(ingredientlist, null, 2));
      }  
    }else{
      throw new Error("Ingredient id "+id+" is not found.");
    }
    return {};
  }

  async listIngredients() {
    let ingredientlist = await this._loadAllIngredients();
    return ingredientlist;
  }

  async _loadAllIngredients() {
    let ingredientlist;
    try {
      ingredientlist = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        ingredientlist = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return ingredientlist;
  }

  _getStorageLocation() {
    return this.ingredientStoragePath;
  }
}

module.exports = IngredientDao;
