import React, { useState, useEffect } from "react";
import axios from "axios";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer"
import noteService from "./services/notes";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };

    noteService.create(noteObject).then((addedNote) => {
      setNotes(notes.concat(addedNote));
      setNewNote("");
    });
  };

  const handleNoteChange = (event) => setNewNote(event.target.value);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((updatedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : updatedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        // remove error message after 5 sec
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) => (
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
