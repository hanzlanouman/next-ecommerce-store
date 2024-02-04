import OrderModel from '@/app/models/orderModel'
import React from 'react'
import dateFormat from 'dateformat'
import SalesChart from '@/app/components/SalesChart'
import GridView from '@/app/components/GridView'
import { formatPrice } from '@/app/utils/helper'



const sevenDaysSalesHistory = async () => {

    //Calculate the date: 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const dateList: string[] = []

    //Create an array of 7 days from today

    for (let i = 0; i < 7; i++) {
        const date = new Date(sevenDaysAgo)
        date.setDate(date.getDate() + i)
        dateList.push(date.toISOString().split('T')[0])
    }


    //Fetch data for those 7 days
    const last7DaysSale: {
        _id: string,
        totalAmount: number

    }[]
        = await OrderModel.aggregate(
            [
                {
                    $match: {
                        createdAt: {
                            $gte: sevenDaysAgo
                        }, paymentStatus: 'paid'
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$createdAt'
                            }
                        },
                        totalAmount: {
                            $sum: '$totalAmount'
                        }

                    }
                }
            ]
        )

    //Compare the date and fill empty sales with 0
    const sales = dateList.map((date) => {
        const matchedsale = last7DaysSale.find(sale => sale._id === date)


        return {
            day: dateFormat(date, 'ddd'),
            sale: matchedsale ? matchedsale.totalAmount : 0
        }
    })

    const totalSales = last7DaysSale.reduce((prevValue, { totalAmount }) => {
        return prevValue += totalAmount
    }, 0)


    return {
        sales, totalSales
    }

    // [{sale: number, day:string}] => [{sale:1000, day: 'mon'}, {sale: 0, day: 'tue'}, ...]
}

const Sales = async () => {

    const salesData = await sevenDaysSalesHistory()


    return (
        <div>
            <GridView>
                <div className="bg-green-400 shadow-md rounded-md p-4 w-[20rem]">
                    <h1
                        className="text-2xl font-semibold text-white"
                    >
                        {formatPrice(salesData.totalSales)}
                    </h1>
                    <div className="text-white text-sm mt-2">
                        <p className="flex items-center space-x-1">
                            <p className="text-md">Total Sales</p>
                            <p className="text-md">Last 7 days</p>
                        </p>
                    </div>

                </div >
            </GridView>

            <div
                className="mt-20"
            >
                <h1
                    className="text-2xl font-semibol mb-4 text-gray-800"
                >
                    Last 7 Days Sales History
                </h1>
                <SalesChart data={salesData.sales} />
            </div>
        </div>
    )
}

export default Sales