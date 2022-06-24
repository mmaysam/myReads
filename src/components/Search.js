import React, { useState, useEffect } from "react";
import * as BooksAPI from "../BooksAPI";
import "../App.css";
import Book from "./Book";

const Search = () => {
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [books, setBooks] = useState([]);
  const [mapOfIdToBooks, setMapOfIdToBooks] = useState(new Map());
  const [searchBooks, setSearchBooks] = useState([]);
  const [mergedBooks, setMergedBooks] = useState([]);

  const [query, setQuery] = useState("");

  useEffect(() => {
    BooksAPI.getAll().then((data) => {
      setBooks(data);
      setMapOfIdToBooks(createMapOfBooks(data));
    });
  }, []);

  useEffect(
    () => {
      let isActive = true;
      if (query) {
        BooksAPI.search(query).then((data) => {
          if (data.error) {
            setSearchBooks([]);
          } else {
            if (isActive) {
              setSearchBooks(data);
            }
          }
        });
      }
      return () => {
        isActive = false;
      };
    },
    [query]
  );
  useEffect(
    () => {
      const combined = searchBooks.map((book) => {
        if (mapOfIdToBooks.has(book.id)) {
          return mapOfIdToBooks.get(book.id);
        } else {
          return book;
        }
      });
      setMergedBooks(combined);
    },
    [searchBooks]
  );

  const createMapOfBooks = (books) => {
    const map = new Map();
    books.map((book) => map.set(book.id, book));
    return map;
  };
  const updateBookShelf = (book, whereTo) => {
    // console.log(book);
    // console.log(whereTo);
    const updatedBooks = books.map((b) => {
      if (b.id === book.id) {
        b.shelf = whereTo;
        return book;
      }
      return b;
    });
    setBooks(updatedBooks);
    BooksAPI.update(book, whereTo);
  };

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <button
          className="close-search"
          onClick={() => setShowSearchPage(false)}
        >
          Close
        </button>
        <div className="search-books-input-wrapper">
          {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
          <input
            type="text"
            placeholder="Search by title or author"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {mergedBooks.map((b) => (
            <li key={b.id}>
              <Book book={b} changeBookShelf={updateBookShelf} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Search;
