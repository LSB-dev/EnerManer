import React, { useState } from 'react';
import { Mail, Phone, Copy, Check, User, Building2, MessageSquarePlus } from 'lucide-react';
import { PlantContact, PlantComment } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ContactInfoPanelProps {
  contact: PlantContact;
  comments: PlantComment[];
  onAddComment: (comment: string) => void;
}

const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({ contact, comments, onAddComment }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <h3 className="font-medium text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-500">{contact.role}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleCopy(contact.email, 'email')}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 group-hover:text-gray-900">{contact.email}</span>
            </div>
            {copiedField === 'email' ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            )}
          </button>

          <button
            onClick={() => handleCopy(contact.phone, 'phone')}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 group-hover:text-gray-900">{contact.phone}</span>
            </div>
            {copiedField === 'phone' ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Kommentare</h4>
        <form onSubmit={handleSubmitComment} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Neuer Kommentar..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              <MessageSquarePlus className="w-5 h-5" />
            </button>
          </div>
        </form>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">{comment.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {comment.timestamp.toLocaleString('de-DE')}
              </p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-gray-500 italic">Keine Kommentare vorhanden</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoPanel;