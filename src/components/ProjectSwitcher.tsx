import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const projects = [
  { name: 'Tata Motors', path: '/case-study/tata-motors' },
  { name: 'VISA/IDFC', path: '/case-study/visa-idfc' },
  { name: 'Vala Heritage', path: '/case-study/vala-heritage' },
  { name: 'Photography', path: '/case-study/photography' },
  { name: 'Illustrations', path: '/case-study/illustrations' }
];

interface ProjectSwitcherProps {
  currentProject: string;
}

export default function ProjectSwitcher({ currentProject }: ProjectSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!isMobile) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          {currentProject}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
            {projects
              .filter(project => project.name !== currentProject)
              .map((project) => (
                <Link
                  key={project.path}
                  href={project.path}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {project.name}
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
} 