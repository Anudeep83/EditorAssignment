"use client"; // Mark this file as a client-side component

import React, { useState, useEffect, useRef } from "react";
import "./global.css"; // Global styles only

const RichTextEditor: React.FC = () => {
  const [todoItems, setTodoItems] = useState<{ text: string; checked: boolean }[]>([]);
  const todoRefs = useRef<(HTMLSpanElement | null)[]>([]); // Refs for each to-do item
  const editorRef = useRef<HTMLDivElement | null>(null); // Ref for the contentEditable div

  // Save checkbox states and texts in localStorage
  const saveCheckboxState = () => {
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
  };

  // Load checkbox states and texts from localStorage
  const loadCheckboxState = () => {
    const savedItems = JSON.parse(localStorage.getItem("todoItems") || "[]");
    setTodoItems(savedItems);
  };

  // Toggle strikethrough based on checkbox state
  const toggleStrikethrough = (index: number) => {
    const updatedItems = [...todoItems];
    updatedItems[index].checked = !updatedItems[index].checked; // Toggle the checked state
    setTodoItems(updatedItems);
    localStorage.setItem("todoItems", JSON.stringify(updatedItems)); // Persist the updated state in localStorage
  };

  // Handle text editing
  const handleTextChange = (index: number, newText: string) => {
    const updatedItems = [...todoItems];
    updatedItems[index].text = newText;
    setTodoItems(updatedItems);
    localStorage.setItem("todoItems", JSON.stringify(updatedItems)); // Save the updated text in localStorage
  };

  // Handle key events for to-do list functionality
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset);

    // Detect "[] + space" to create a to-do item at the start of a line
    if (e.key === " " && textBeforeCursor === "[]") {
      e.preventDefault();
      const newTodoItem = { text: "", checked: false };
      const updatedItems = [...todoItems, newTodoItem];
      setTodoItems(updatedItems);

      // Update refs to include the new to-do item and focus on it
      setTimeout(() => {
        todoRefs.current[todoRefs.current.length - 1]?.focus();
      }, 0);

      localStorage.setItem("todoItems", JSON.stringify(updatedItems));
    }

    // Handle "Enter" to continue a to-do list
    if (e.key === "Enter") {
      e.preventDefault();
      const newTodoItem = { text: "", checked: false };
      const updatedItems = [...todoItems, newTodoItem];
      setTodoItems(updatedItems);

      // Update refs to include the new to-do item and focus on it
      setTimeout(() => {
        todoRefs.current[todoRefs.current.length - 1]?.focus();
      }, 0);

      localStorage.setItem("todoItems", JSON.stringify(updatedItems));
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("todoItems"); // Remove specific data from local storage
    setTodoItems([]); // Clear the state
  };

  // Load checkbox state on component mount
  useEffect(() => {
    loadCheckboxState();
  }, []);

  // Function to handle placeholder visibility
  const handleFocus = () => {
    if (editorRef.current && editorRef.current.textContent !== "") {
      editorRef.current.classList.add("has-content");
    }
  };

  const handleBlur = () => {
    if (editorRef.current && editorRef.current.textContent === "") {
      editorRef.current.classList.remove("has-content");
    }
  };

  return (
    <div className="bg-container">
      {/* Content Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="editor text"
      ></div>

      {/* To-Do List Section */}
      <div className="mt-4">
        {todoItems.map((item, index) => (
          <div key={index} className="todo-item text">
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={item.checked}
              onChange={() => toggleStrikethrough(index)} // Toggle strikethrough when clicked
            />
            <span
              className={`todo-text ${item.checked ? "line-through" : "text-black"}`} // Add strikethrough when checked
              contentEditable
              onBlur={(e) => handleTextChange(index, e.currentTarget.innerText)} // Save text when focus is lost
              ref={(el) => {
                todoRefs.current[index] = el; // Assign the element to the ref array
              }} // Ensure the callback doesn't return anything
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Clear Data Button */}
      <button
        className="button mt-4"
        onClick={clearLocalStorage} // Clear local storage when clicked
      >
        Clear Data
      </button>
    </div>
  );
};

export default RichTextEditor;
