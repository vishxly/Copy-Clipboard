import React, { useState, useEffect, useRef } from 'react';
import { getLinks, logout, saveLink } from '../services/api';

function Dashboard({ setIsLoggedIn }) {
  const [links, setLinks] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const plusButtonRef = useRef(null);

  useEffect(() => {
    fetchLinks();
    document.addEventListener('mouseup', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, []);

  const fetchLinks = async () => {
    try {
      const fetchedLinks = await getLinks();
      setLinks(fetchedLinks);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  const handleSaveCurrentPage = async () => {
    try {
      await saveLink(document.title, window.location.href);
      alert('Current page saved successfully!');
      fetchLinks();
    } catch (error) {
      console.error('Failed to save current page:', error);
      alert('Failed to save current page. Please try again.');
    }
  };

  const handleTextSelection = (e) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      showPlusButton(e.pageX, rect.top + window.pageYOffset - 30);
    } else {
      setSelectedText('');
      hidePlusButton();
    }
  };

  const showPlusButton = (x, y) => {
    if (plusButtonRef.current) {
      plusButtonRef.current.style.display = 'block';
      plusButtonRef.current.style.left = `${x}px`;
      plusButtonRef.current.style.top = `${y}px`;
    }
  };

  const hidePlusButton = () => {
    if (plusButtonRef.current) {
      plusButtonRef.current.style.display = 'none';
    }
  };

  const handleSaveSelectedText = async () => {
    if (selectedText) {
      try {
        await saveLink(selectedText, window.location.href);
        alert('Selected text saved successfully!');
        fetchLinks();
        setSelectedText('');
        hidePlusButton();
      } catch (error) {
        console.error('Failed to save selected text:', error);
        alert('Failed to save selected text. Please try again.');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Saved Links</h1>
        <div>
          <button
            onClick={handleSaveCurrentPage}
            className="px-4 py-2 bg-green-500 text-white rounded mr-2"
          >
            Save Current Page
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link._id} className="p-2 bg-gray-100 rounded">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
      <button
        ref={plusButtonRef}
        onClick={handleSaveSelectedText}
        className="fixed w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold"
        style={{ display: 'none', zIndex: 1000 }}
      >
        +
      </button>
    </div>
  );
}

export default Dashboard;
