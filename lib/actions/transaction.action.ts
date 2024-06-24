"use server"

import { CheckoutTransactionParams, CreateTransactionParams } from "@/types"
import { redirect } from "next/navigation"
import Stripe from "stripe"
import { prisma } from "../prismaClient"
import { updateCredits } from "./user.actions"




export const checkoutCredits = async (transaction:CheckoutTransactionParams) => {
    
    const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_KEY!)

    const amount = Number(transaction.amount * 100)

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: amount,
              product_data: {
                name: transaction.plan,
              }
            },
            quantity: 1
          }
        ],
        metadata: {
          plan: transaction.plan,
          credits: transaction.credits,
          buyerId: transaction.buyerId,
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
      })
    
      redirect(session.url!)
    }


    export async function createTransaction(transaction: CreateTransactionParams) {
  try {

    // Create a new transaction with a buyerId
    const newTransaction = await prisma.transaction.create({
      data:{
        ...transaction,
        buyer:{connect:{id:transaction.buyerId}}
      }
    })

    await updateCredits(transaction.buyerId, transaction.credits);

    return newTransaction ;
  } catch (error) {
     console.log(error)
  }
}



