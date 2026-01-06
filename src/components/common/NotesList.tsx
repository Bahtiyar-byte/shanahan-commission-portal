import { useState } from 'react';
import { Send, AtSign } from 'lucide-react';
import type { LoadNote } from '../../types';
import { tagOptions } from '../../data/mockData';

interface NotesListProps {
  notes: LoadNote[];
  onAddNote?: (content: string) => void;
}

export function NotesList({ notes, onAddNote }: NotesListProps) {
  const [newNote, setNewNote] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const handleSubmit = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  const handleTagSelect = (name: string) => {
    setNewNote((prev) => prev + `@${name} `);
    setShowTagDropdown(false);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Notes & Activity</h4>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{note.author}</span>
                <span className="text-xs text-gray-500">{note.date}</span>
              </div>
              <p className="text-sm text-gray-700">{note.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="relative">
        <div className="flex items-start gap-2">
          <div className="relative flex-1">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note... Use @ to mention someone"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
              rows={2}
            />
            <button
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className="absolute right-2 bottom-2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <AtSign className="w-4 h-4 text-gray-400" />
            </button>
            {showTagDropdown && (
              <div className="absolute right-0 bottom-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {tagOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleTagSelect(option.name)}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>{option.name}</span>
                    <span className="text-xs text-gray-400">{option.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!newNote.trim()}
            className="p-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0b7c72] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
