import React from 'react'
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { IoMdArchive } from "react-icons/io";
import { FaCopy } from "react-icons/fa6";

const Notes = () => {

  const [noteText, setNoteText] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [searchText, setSearchText] = useState("")

  const charLimit = 300
  const titleLimit = 25

  let initNote
  if (localStorage.getItem("notesData") === null) {
    initNote = []
  }
  else {
    initNote = JSON.parse(localStorage.getItem("notesData"))
  }

  let initArchive
  if (localStorage.getItem("archivedNotes") === null) {
    initArchive = []
  }
  else {
    initArchive = JSON.parse(localStorage.getItem("archivedNotes"))
  }

  const [notes, setNotes] = useState(initNote)
  const [archive, setArchive] = useState(initArchive)

  useEffect(() => {
    localStorage.setItem("notesData", JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem("archivedNotes", JSON.stringify(archive))
  }, [archive])

  const handleNoteText = (event) => {
    if (charLimit - event.target.value.length >= 0) {
      setNoteText(event.target.value)
    }
  }

  const handleNoteTitle = (event) => {
    if (titleLimit - event.target.value.length >= 0) {
      setNoteTitle(event.target.value)
    }
  }

  const handleSearch = (event) => {
    setSearchText(event.target.value)
  }

  const AddNote = () => {
    if (noteText.trim().length > 0) {
      let date = new Date()
      let newNote = {
        id: uuidv4(),
        title: noteTitle,
        text: noteText,
        date: date.toLocaleDateString()
      }
      setNotes([newNote, ...notes])
      setNoteText("")
      setNoteTitle("")
    }
  }

  const deleteNote = (id, title) => {
    let okay = confirm(`Are you sure you want to delete "${title}"`)
    if (okay) {
      let newNotes = notes.filter((item) => item.id !== id)
      setNotes(newNotes)
    }
  }

  const editNote = (id) => {
    let note = notes.filter(i => i.id === id)
    setNoteText(note[0].text)
    setNoteTitle(note[0].title)
    let newNotes = notes.filter((item) => item.id !== id)
    setNotes(newNotes)
  }

  const archiveNote = (note) => {
    let date = new Date()
    let newNotes = notes.filter((item) => item.id !== note.id)
    setNotes(newNotes)

    let newNote = {
      id: note.id,
      title: note.title,
      text: note.text,
      date: date.toLocaleDateString()
    }
    setArchive([...archive, newNote])
  }

  const copyNote = (text) => {
    navigator.clipboard.writeText(text)
    alert("Note copied to clipboard")
  }

  return (
    <section className={`bg-purple-200 w-full px-10 py-7 flex flex-col dark:bg-neutral-700`}>
      <article className="canvas h-full flex flex-col">
        <div className="header">
          <h2 className='text-xl font-bold dark:text-white'>Your Notes</h2>
          <hr className='bg-slate-500 border-slate-400 h-[2px] my-3 dark:border-2 dark:border-neutral-600' />
        </div>
        <div className="notes overflow-y-auto mb-2 flex flex-col flex-grow">

          <div className="notelist grid gap-4 h-0">
            <section className='note bg-purple-400 min-h-[300px] max-h-[300px] rounded-lg flex flex-col justify-between overflow-hidden dark:bg-neutral-800'>
              <div className="content h-full">
                <input onChange={handleNoteTitle} className="title font-bold py-1 px-3 bg-purple-500 w-full placeholder-white focus:outline-none dark:bg-neutral-900 dark:text-white" value={noteTitle} placeholder='Add title' />
                <textarea onChange={handleNoteText} className='text px-3 py-2 w-full h-[calc(100%-32px)] bg-purple-400 placeholder-white focus:outline-none resize-none dark:bg-neutral-800 dark:text-white' value={noteText} placeholder='Type to add a new note'></textarea>
              </div>
              <div className="noteFooter flex flex-col">
                <hr className='bg-purple-500 h-[1.5px] border-0 dark:bg-neutral-700' />
                <div className="px-3 flex justify-between items-center">
                  <small className={noteText.length >= 280 ? "text-red-500" : "text-white"}>{charLimit - noteText.length} remaining</small>
                  <button onClick={AddNote} disabled={noteText.length <= 8 || noteTitle.length <= 3} className='bg-purple-600 disabled:bg-purple-500 hover:bg-purple-600  px-[6px] my-[6px] rounded-md cursor-pointer text-white dark:bg-neutral-900'>Add</button>
                </div>
              </div>
            </section>
            {
              notes.filter((item) => item.title.toLowerCase().includes(searchText.toLocaleLowerCase())).map((item) => {
                return (
                  <section key={item.id} className='note bg-purple-400 min-h-[300px] max-h-[300px] rounded-lg flex flex-col justify-between overflow-hidden dark:bg-neutral-800 dark:text-white'>
                    <div className="content">
                      <h2 className="title font-bold py-1 px-3 bg-purple-500 dark:bg-neutral-900">{item.title}</h2>
                      <div className='text py-2 px-3 max-h-[232px] overflow-y-auto whitespace-pre-wrap break-words'>{item.text}</div>
                    </div>
                    <div className="noteFooter flex flex-col">
                      <hr className='bg-purple-500 h-[1.5px] border-0 dark:bg-neutral-700' />
                      <div className="px-3 flex justify-between items-center">
                        <small>{item.date}</small>
                        <div className="btns flex gap-1">
                          <span onClick={() => copyNote(item.text)} className='hover:bg-purple-500 p-[6px] my-1 rounded-[50%] cursor-pointer dark:hover:bg-neutral-900'><FaCopy /></span>
                          <span onClick={() => archiveNote(item)} className='hover:bg-purple-500 p-[6px] my-1 rounded-[50%] cursor-pointer dark:hover:bg-neutral-900'><IoMdArchive /></span>
                          <span onClick={() => editNote(item.id)} className='hover:bg-purple-500 p-[6px] my-1 rounded-[50%] cursor-pointer dark:hover:bg-neutral-900'><FaEdit /></span>
                          <span onClick={() => deleteNote(item.id, item.title)} className='hover:bg-purple-500 p-[6px] my-1 rounded-[50%] cursor-pointer dark:hover:bg-neutral-900'><MdDelete /></span>
                        </div>
                      </div>
                    </div>
                  </section>
                )
              })
            }
          </div>
        </div>
        <div className="search flex items-center bg-white rounded-md mt-auto dark:bg-neutral-300">
          <input onChange={handleSearch} className='py-1 px-1 w-[100%] rounded-md text-lg text-slate-700 focus:outline-none dark:bg-neutral-300 dark:text-slate-900' type="text" placeholder='Type to search a note' />
          <span className="searchIcon py-2 px-3"><FaSearch /></span>
        </div>
      </article>
    </section>
  )
}

export default Notes
