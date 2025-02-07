import mongoose from "mongoose";
import { Event } from "../models/event.js";
import { Participant } from "../models/participant.js";

export class EventController {
    static async getAll(req, res) {
        const events = await Event.find();
        res.status(200).json(events);
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { title, description, date, location } = req.body;
            const updatedEvent = await Event.findByIdAndUpdate(
                { _id: id },
                { title, description, date: date ? new Date(date) : date, location },
                { new: true }
            );
            res.status(200).json({ message: "Evento atualizado com sucesso", event: updatedEvent });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async get(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Dados inválidos.' });
            const event = await Event.findById(id);
            if (!event) return res.status(404).json({ message: "Evento não encontrado" });
            res.status(200).json(event);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async create(req, res) {
        try {
            const { title, description, date, location } = req.body;
            const event = await Event.create({ title, description, date: new Date(date), location });
            console.log(event);
            res.status(201).json({ message: "Evento criado com sucesso", event });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async addParticipant(req, res) {
        try {
            const { participantIds, eventId } = req.body;
            if (!participantIds || !Array.isArray(participantIds)) return res.status(400).json({ message: 'Dados inválidos.' });
            const participants = await Participant.find({
                '_id': { $in: participantIds.map(id => new mongoose.Types.ObjectId(id)) }
            });
            const updatedEvent = await Event.findByIdAndUpdate(
                { _id: eventId },
                { $push: { participants: { $each: participants } } },
                { new: true }
            );
            res.status(201).json({ message: "Participantes adicionados com sucesso", event: updatedEvent });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async removeParticipant(req, res) {
        try {
            const { participantIds, eventId } = req.body;
            if (!participantIds || !Array.isArray(participantIds)) return res.status(400).json({ message: 'Dados inválidos.' });
            const participants = await Participant.find({
                '_id': { $in: participantIds.map(id => new mongoose.Types.ObjectId(id)) }
            });
            const updatedEvent = await Event.findByIdAndUpdate(
                { _id: eventId },
                { $pull: { participants: { _id: participants } } },
                { new: true }
            );
            console.log(updatedEvent);
            res.status(200).json({ message: "Participantes removidos com sucesso", event: updatedEvent });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async destroy(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Dados inválidos.' });
            await Event.findByIdAndDelete(id);
            res.status(204).json({ message: 'Evento deletado com sucesso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}
