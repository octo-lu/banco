import { Event } from "../models/event.js";
import { Participant } from "../models/participant.js";

export class ParticipantController {
    static async getAll(req, res) {
        try {
            const participants = await Participant.find();
            res.status(200).json(participants);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async getEvents(req, res) {
        try {
            const { id } = req.params;
            const events = await Event.find({ "participants._id": id });
            res.status(200).json(events);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, course, institution, group } = req.body;
            const updatedParticipant = await Participant.findByIdAndUpdate(
                { _id: id },
                { name, course, institution, group },
                { new: true }
            );
            res.status(200).json({ message: "Participante atualizado com sucesso", participant: updatedParticipant });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async get(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Dados inválidos.' });
            const participant = await Participant.findById(id);
            console.log(participant);
            res.status(200).json(participant);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async create(req, res) {
        try {
            const { name, course, institution, group } = req.body;
            const participant = await Participant.create({ name, course, institution, group });
            console.log(participant);
            res.status(201).json({ message: "Participante criado com sucesso", participant });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async destroy(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Dados inválidos.' });
            await Participant.findByIdAndDelete(id);
            await Event.updateMany(
                { "participants._id": id },
                { $pull: { participants: { _id: [id] } } }
            );
            return res.status(204).json({ message: 'Participante deletado com sucesso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}
