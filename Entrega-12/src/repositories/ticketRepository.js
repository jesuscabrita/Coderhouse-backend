import { productsModel } from "../dao/models/products.js";
import { ticketModel } from "../dao/models/ticket.js";
import { userModel } from "../dao/models/user.js";

export class TicketRepository {
    static instance = null;

    static getInstance() {
        if (!TicketRepository.instance) {
            TicketRepository.instance = new TicketRepository();
        }
        return TicketRepository.instance;
    }
    constructor() { }

    modelGetTicket = () => {
        return ticketModel.find();
    }

    modelCreateTicket = (newTicket) =>{
        return ticketModel.create(newTicket)
    }

    modelUserUpdateOne = (filter, update) => {
        return userModel.updateOne(filter, update);
    };

    modelUpdateProduct = (product) => {
        return productsModel.findByIdAndUpdate(product._id, product, { new: true });
    };

}