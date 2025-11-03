import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookmarkContextType {
  bookmarks: Set<string>;
  toggleBookmark: (factId: string) => void;
  isBookmarked: (factId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const toggleBookmark = (factId: string) => {
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(factId)) {
        newBookmarks.delete(factId);
      } else {
        newBookmarks.add(factId);
      }
      return newBookmarks;
    });
  };

  const isBookmarked = (factId: string) => {
    return bookmarks.has(factId);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within BookmarkProvider');
  }
  return context;
}
