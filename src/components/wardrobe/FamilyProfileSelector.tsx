import React, { useState } from 'react';
import {
  Users,
  User,
  Plus,
  Heart,
  Smile,
  Shield,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { FamilyProfile } from '../../types';

interface FamilyProfileSelectorProps {
  profiles: FamilyProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (profile: FamilyProfile) => void;
}

export const FamilyProfileSelector: React.FC<FamilyProfileSelectorProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState<
    'Self' | 'Partner' | 'Child' | 'Parent' | 'Other'
  >('Partner');
  const [newGender, setNewGender] = useState<'Female' | 'Male' | 'Unisex'>('Female');

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProf: FamilyProfile = {
      id: `fam-${Date.now()}`,
      name: newName.trim(),
      relationship: newRelationship,
      gender: newGender,
      avatarEmoji:
        newRelationship === 'Child'
          ? '👧'
          : newRelationship === 'Partner'
          ? '🧑'
          : newRelationship === 'Parent'
          ? '👵'
          : '👤',
      itemsCount: 0,
      createdAt: new Date().toISOString(),
    };

    onAddProfile(newProf);
    onSelectProfile(newProf.id);
    setNewName('');
    setIsAddingNew(false);
  };

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none">
      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 pl-1 pr-2 flex-shrink-0">
        <Users className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Wardrobe Mode:</span>
      </div>

      {/* Profiles Pills */}
      {profiles.map((p) => {
        const isActive = p.id === activeProfileId;
        return (
          <button
            key={p.id}
            onClick={() => onSelectProfile(p.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all flex-shrink-0 ${
              isActive
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300'
            }`}
          >
            <span>{p.avatarEmoji || '👤'}</span>
            <span>{p.name}</span>
            {p.itemsCount !== undefined && p.itemsCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {p.itemsCount}
              </span>
            )}
          </button>
        );
      })}

      {/* Add New Profile Button / Form */}
      {isAddingNew ? (
        <form
          onSubmit={handleCreateProfile}
          className="flex items-center space-x-1.5 bg-slate-900 border border-amber-500/60 p-1 rounded-xl flex-shrink-0"
        >
          <input
            type="text"
            placeholder="Name (e.g. Aarav, Rahul)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-2 py-1 bg-slate-950 text-white text-xs rounded-lg border border-slate-800 focus:outline-none w-36"
            autoFocus
          />
          <select
            value={newRelationship}
            onChange={(e) => setNewRelationship(e.target.value as any)}
            className="px-1.5 py-1 bg-slate-950 text-slate-300 text-xs rounded-lg border border-slate-800"
          >
            <option value="Partner">Partner</option>
            <option value="Child">Child</option>
            <option value="Parent">Parent</option>
            <option value="Other">Other</option>
          </select>
          <button
            type="submit"
            className="p-1 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsAddingNew(false)}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-900/50 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-400 hover:text-amber-400 text-xs font-semibold flex items-center space-x-1 transition-colors flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Family Profile</span>
        </button>
      )}
    </div>
  );
};
