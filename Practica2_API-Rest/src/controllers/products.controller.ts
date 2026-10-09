import type { Request, Response } from "express"
import pool from "../conf/dbConnection.ts"

export class ProductsController{

    public async getAllProducts(_req:Request, res:Response){
        const query = 'select * from products where active=TRUE';
        await pool.execute(query)
        .then(([result, _])=>{
            res.status(200).json(result);
        })
        .catch((err)=>{
            console.log(err) // solo para development
            res.status(500).json({message: 'internal server error'})
        });
    }


    public async getProductById(req:Request, res:Response){
        const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ message: 'id must be a positive number' });
                return;
            }
        const query = 'select * from products where id=? and active = TRUE'

        await pool.execute(query, [id])
        .then(([result, _])=>{
            if (!Array.isArray(result) || result.length === 0) {
                return res.status(404).json({ message: 'product not found' });
            }
            res.status(200).json(result);

        }).catch((err)=>{
            console.log(err) // solo para development
            res.status(500).json({message: 'internal server error'})
        });
    }


    public async createProduct(req:Request, res:Response){
        const { name, price, stock, description, brand, img } = req.body;
        const query = `insert into products 
        (name, price, stock, description, brand, img)
        values (?,?,?,?,?,?)`

        await pool.execute(query, [name, price, stock, description, brand, img]);
        res.status(201).json({message: 'product created'});
    }


    public async updateProductById(req:Request, res:Response){
        try{
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ message: 'id must be a positive number' });
                return;
            }

            const { name, price, stock, description, brand, img } = req.body;
            const query = `update products set name = ?, price = ?, stock = ?,
            description = ?, brand = ?, img = ? where id = ? and active = TRUE`

            const [result] = (await pool.execute(query, [
                name,
                price,
                stock,
                description,
                brand,
                img,
                id
            ])) as any;

            if (result.affectedRows > 0){
                return res.status(200).json({message: 'product updated'});
            }
            res.status(404).json({message: 'product not found'});
        } catch (err){
            
            res.status(500).json({message: 'product updated'})
        }
    }


    public async deleteProductById(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ message: 'id must be a positive number' });
                return;
            }
            const query = `update products set active = FALSE where id = ? and active = TRUE`;
            const [result] = (await pool.execute(query, [
                id
            ])) as any
    
            if (result.affectedRows > 0){
                return res.status(200).json({message: 'product deleted'});
            }
            res.status(404).json({message: 'product not found'});
    
        } catch (err){
            res.status(500).json({message: 'internal server error'})
        }
    }


    public async updateProductPriceById(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            const price = Number(req.body.price)
            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ message: 'id must be a positive number' });
                return;
            }

            if (!Number.isFinite(price) || price<=0){
                res.status(400).json({message: 'price must be greater than zero'});
                return;
            }

            const query = `update products set price = ? where id = ?`;
            const [result] = (await pool.execute(query, [
                price,
                id
            ])) as any
    
            if (result.affectedRows > 0){
                return res.status(200).json({message: 'product price updated'});
            }
            res.status(404).json({message: 'product not found'});
    
        } catch (err){
            res.status(500).json({message: 'internal server error'})
        }
    }
}