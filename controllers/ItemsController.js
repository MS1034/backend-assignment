import Items  from "../models/items.js"
import AppError from "../utils/CustomError.js"
import { funcErrorWraper } from "../utils/ErrorHandler.js"
import generator from "../utils/IdGenerator.js"


export const getItems = funcErrorWraper((req,res) =>{
    let visibility = req.query.visibility;
    if(visibility)
        visibility = visibility==='true'
    else
        visibility = true
    const items = Items.getItems(visibility)
    res.status(200).json(items)
})


export const getItemById = funcErrorWraper((req,res) =>{
    const id = +req.params.id
    const result  = Items.getItemById(id)
    console.log(result)
    if(result)
        res.status(200).json(result)
    else
        throw new AppError(`Record with id=${id} not found.`,404)
})

export const createItem = funcErrorWraper((req,res) =>{
    const {title,time,link} = req.body
    const isVisible = req.body.isVisible ?? true

    console.log(`isVisible ${isVisible}`)

    if(!title || !time || !link)
        throw new AppError(`Title, Time and Link is required to create a js topic.`,400)
  
    const result  = Items.createItem(title,time,link,isVisible)
    console.log(result)
    if(result)
        res.status(201).json(result)
    else
        throw new AppError(`Failed to create new object`,500)
})


export const updateItem = funcErrorWraper(
    (req,res) => {
        //TODO : implement updation with selective parameters 
    }
)


export const changeVisibility = funcErrorWraper(
    (req,res) => {
        //TODO: implement change visibility with error statuses
    }
)



export const deleteItem = funcErrorWraper(
    (req,res) => {
    const id = +req.params.id
    const result  = Items.deleteItem(id)
    if(result)
        res.status(200).json(result)
    else
        throw new AppError(`Record with id=${id} not found.`,404)
    }
)


