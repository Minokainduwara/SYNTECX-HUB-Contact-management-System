import {Request, Response} from 'express';
import Contact from '../models/contact';

// Create a new contact
export const createContact = async(req: Request, res: Response) => {
    const contact = await Contact.create(req.body);
    res.json(contact);
};

// Get all contacts
export const getContacts = async(req: Request, res: Response) => {
    const contacts = await Contact.find();
    res.json(contacts);
};

// Get a contact by ID
export const getContactById = async(req: Request, res: Response) => {
    const contact = await Contact.findById(req.params.id);
    res.json(contact);
};

// Update a contact by ID
export const updateContact = async(req: Request, res: Response) => {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

// Delete a contact by ID
export const deleteContact = async(req: Request, res: Response) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
};


