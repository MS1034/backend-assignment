import idGenerator from "../utils/IdGenerator.js";

export default class Items
{
    static topics = [
        {
            "title": "Web Workers",
            "time" : 34,
            "link": "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers",
            "isVisible": true        
        },
        {
            "title": "Closure",
            "time" : 45,
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
            "isVisible": false        
        },
        {
            "title": "Scope and Hoisting",
            "time" : 200,
            "link": "https://www.freecodecamp.org/news/scope-in-javascript-global-vs-local-vs-block-scope/",
            "isVisible": true        
        }
    ];


    static addIds()
    {
        Items.topics.forEach((item)=> item.id = idGenerator.next().value)
    }

    static createItem(title, time, link,isVisible) {
        const newItem = {
          id: idGenerator.next().value,
          title,
          time,
          link,
          isVisible
        };
        Items.topics.push(newItem);
        return newItem;
    }

    static getItems(visibility) {
        return Items.topics.filter((item)=>item.isVisible===visibility);
    }

    static getItemById(id) {
        return Items.topics.find(item => item.id === id);
    }

    static updateItem(id, updatedItem) {
        const index = Items.topics.findIndex(item => item.id === id);
        if (index !== -1) {
          Items.topics[index] = { ...updatedItem, id };
          return true;
        }
        return false;
    }

    static changeVisibilit(id,visibility)
    {
        // TODO: see the requirement document and update this method
        const index = Items.topics.findIndex(item => item.id === id);
        if (index !== -1) {
            Items.topics[index].isVisible = visibility;
            return true;
          }
          return false;
    }

    static deleteItem(id) {
        const index = Items.topics.findIndex(item => item.id === id);
        if (index !== -1) {
          const item = Items[index]
          Items.topics.splice(index,1)
          return item;
        }
        return null;
    }
}

Items.addIds()