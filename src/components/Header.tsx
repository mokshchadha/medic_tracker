// components/Header.tsx
import React from 'react';
import { User, Plus, Pill, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = ({ onAddPatient, onAddMedicine }) => {
  const { username, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="w-8 h-8 mr-2 text-blue-600" />
            Patient Manager
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="text-sm text-gray-600 hidden sm:block">
              Welcome, <span className="font-medium">{username}</span>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              <button
                onClick={onAddMedicine}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center text-sm"
              >
                <Pill className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add Medicine</span>
              </button>
              <button
                onClick={onAddPatient}
                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add Patient</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 flex items-center text-sm"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;