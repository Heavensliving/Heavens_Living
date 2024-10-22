
import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'

const ListItem = ({ order, mealType, expandedOrder, onExpand, }) => {
  return (
    <div>
      <li
        className="bg-yellow-100 p-3 rounded-lg mb-2 cursor-pointer hover:bg-yellow-200"
        onClick={() => onExpand(order.orderId)}
      >
        <div className="flex justify-between">
          <span className="font-semibold">{order.name}</span>
          <button onClick={() => onMarkAsDelivered(order.orderId)} className="text-green-500">
            <FaCheckCircle />
          </button>
        </div>
        {expandedOrder === order.orderId && (
          <div className="mt-2">
            <p>Order Id: {order.orderId}</p>
            <p>Room No: {order.roomNo}</p>
            <p>Contact No: {order.contact}</p>
          </div>
        )}
      </li>
    </div>
  )
}

export default ListItem

  