import React from 'react';
import { BellIcon } from 'lucide-react';
interface HeaderProps {
  toggleSidebar: () => void;
  activeModule: string;
}
export function Header({ toggleSidebar, activeModule }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-md lg:hidden">

          <div className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center text-sm text-gray-500">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">{activeModule}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:block relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out" />

        </div>

        <button className="p-2 text-gray-400 hover:text-gray-500 relative">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          <BellIcon className="h-6 w-6" />
        </button>
      </div>
    </header>);

}