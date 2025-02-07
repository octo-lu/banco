import { Livro } from "../models/livro.js";

export class LivroController {
    static async getAll(req, res) {
        const books = await Livro.find();
        res.status(200).json(books);
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { title, publisher, price, pages } = req.body;
            const updatedBook = await Livro.findByIdAndUpdate({ _id: id }, { title, publisher, price, pages });
            res.status(200).json({ message: "Livro atualizado com sucesso", book: updatedBook });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    static async get(req, res) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Dados inválidos.' });
        const book = await Livro.findById(id);
        if (!book) return res.status(404).json({ message: "Livro não encontrado" });
        res.status(200).json(book);
    }

    static async create(req, res) {
        const { title, publisher, price, pages } = req.body;
        const book = await Livro.create({ title, publisher, price, pages });
        console.log(book);
        res.status(201).json({ message: "Livro criado com sucesso", book });
    }

    static async destroy(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Dados inválidos.' });
            await Livro.findByIdAndDelete(id);
            res.status(204).json({ message: 'Livro deletado com sucesso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}
