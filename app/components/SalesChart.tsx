"use client"

import React from 'react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { formatPrice } from '../utils/helper'

interface Props {
    data: {
        day: string,
        sale: number
    }[]

}

const SalesChart = ({ data }: Props) => {

    return (
        <LineChart
            width={520}
            height={250}
            data={data}
            margin={{
                top: 25, right: 50, left: 100, bottom: 25,
            }}


        >
            <Line type='monotone' dataKey="sale" stroke='#0f0' />
            <XAxis dataKey="day"
                stroke="#aaa"
                shapeRendering='crispEdges'
                tickLine={false}
                tickMargin={10}
            />
            <YAxis
                dataKey={'sale'}
                stroke="#aaa"
                shapeRendering={'crispEdges'}
                tickFormatter={(value) => {
                    return formatPrice(value)
                }}

                // add some margin to right side
                tickMargin={10}
            />

            <Tooltip
                labelFormatter={(value) => {
                    return `Day: ${value}`
                }}
                formatter={(value) => {
                    return formatPrice(value as number)
                }}
            />
            <CartesianGrid stroke="#ccc"
                strokeDasharray={'5 5'}
            />
        </LineChart>
    )
}

export default SalesChart