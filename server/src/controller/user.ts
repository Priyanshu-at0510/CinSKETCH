import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import { signUpInput } from '@adityaat2810/cine-draw';
import ErrorHandler from "../lib/errorHandler.js";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { db } from "../lib/db.js";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
const prisma = db;

export const SECRET_KEY: Secret = process.env.SECRET_KEY as string;

export const Signup = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    // Zod validation 
    const success = signUpInput.safeParse(req.body);
    console.log(success);
    if (!success.success) {
        return next(new ErrorHandler("Please add all fields", 400));
    }

    const user = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    });

    if (user) {
        return next(new ErrorHandler("User already exists with this email", 400));
    }

    let { username, email, passwordHash, avatarUrl } = req.body;

    const salt = genSaltSync(10);
    const hash = hashSync(passwordHash, salt);

    req.body.passwordHash = hash;

    const createUser = await prisma.user.create({
        data: req.body
    });

    return res.status(200).json({
        message: createUser,
        success: true
    });
});

export const SignIn = TryCatch(
    async (req, res, next) => {
        const { email, passwordHash } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            return next(new ErrorHandler("user not exists", 404))
        }

        const hash = user.passwordHash;
        const isMatch = compareSync(passwordHash, hash);

        if (!isMatch) {
            return next(new ErrorHandler("Incorrect password", 404))
        }

        const token = jwt.sign({ _id: user.id?.toString(), email: user.email }, SECRET_KEY, {
            expiresIn: '2 days',
        });

        return res.status(200).json({
            token: token,
            success: true
        })
    }
)

export const getUserDetails = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header

        if (!token) {
            return next(new ErrorHandler('No token provided', 401));
        }

        const decoded = SECRET_KEY ? jwt.verify(token, SECRET_KEY) : jwt.decode(token);

        if (!decoded || typeof decoded !== 'object') {
            return next(new ErrorHandler('Invalid token', 401));
        }

        console.log(' i am here ')

        const { email } = decoded as JwtPayload;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        return res.status(200).json({
            data: user,
            success: true
        });

    }
);

export const getUserById= TryCatch(
    async(req,res,next)=>{


        const {userId}=req.body 
        console.log(req.body)
        if(!userId){
            return next(new ErrorHandler('Id toh dede kutte ',404))
        }


        const user = prisma.user.findFirst({
            where:{
                id:userId
            }
        })

        return res.status(200).json({
            data:user ,
            success:true 
        })
    }
)