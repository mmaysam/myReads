import React, { useState, useEffect } from "react";
import * as BooksAPI from "../BooksAPI";
import "../App.css";
import Header from "./Header";
import Shelves from "./Shelves";
import { Link } from "react-router-dom";

const BooksApp = () => {
  //   /**
  //    * TODO: Instead of using this state variable to keep track of which page
  //    * we're on, use the URL in the browser's address bar. This will ensure that
  //    * users can use the browser's back and forward buttons to navigate between
  //    * pages, as well as provide a good URL they can bookmark and share.
  //    */

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
    <div className="app">
      {/*main page*/}

      <div className="list-books">
        <Header />
        <div className="list-books-content">
          <Shelves books={books} updateBookShelf={updateBookShelf} />
        </div>

        <div className="open-search">
          <Link to="/search">
            <button>Add a book</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BooksApp;
