import { TicketService } from "../dao/services/ticketService.js";

const ticketService = TicketService.getInstance();

export const getTicket = async (req, res) => {
    try {
        const response = await ticketService.getTicket();
        res.status(200).send(response);
    } catch (error) {
        res.status(404).send({ status:'error', error: error.message });
    }
};

export const getTicketById = async (req, res) => {
    const tid = req.params.tid;
    try {
        const ticket = await ticketService.getTicketById(tid);
        return res.status(200).send({ ticket });
    } catch (error) {
        return res.status(404).send({status:'error', error: error.message });
    }
};

export const createTicket = async (req, res) => {
    try {
        const uid = req.params.uid;
        const newTicket = await ticketService.createTicket(uid);
        return res.status(201).send({ status: 'Succes', message: 'Se creó el ticket correctamente', ticket: newTicket });
    } catch (err) {
        return res.status(400).send({ status: "error", error: err.message });
    }
};