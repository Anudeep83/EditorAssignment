"use client"; // Mark this file as a client-side component

import React, { useState, useEffect } from "react";
import './global.css'; // Global styles only

const RichTextEditor: React.FC = () => {
  const [todoItems, setTodoItems] = useState<{ text: string; checked: boolean }[]>([]);

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
      localStorage.setItem("todoItems", JSON.stringify(updatedItems));
    }

    // Handle "Enter" to continue a to-do list
    if (e.key === "Enter") {
      e.preventDefault();
      const newTodoItem = { text: "", checked: false };
      const updatedItems = [...todoItems, newTodoItem];
      setTodoItems(updatedItems);
      localStorage.setItem("todoItems", JSON.stringify(updatedItems));
    }
  };

  // Load checkbox state on component mount
  useEffect(() => {
    loadCheckboxState();
  }, []);

  return (
    <div>
      {/* Toolbar for text formatting */}
      <div className="toolbar">
        <button className="button" onClick={() => document.execCommand("bold")}>
          Bold
        </button>
        <button className="button" onClick={() => document.execCommand("italic")}>
          Italic
        </button>
        <button className="button" onClick={() => document.execCommand("underline")}>
          Underline
        </button>
      </div>

      {/* Content Editable Area */}
      <div
        contentEditable
        onKeyDown={handleKeyDown}
        className="editor"
      >
        {/* Placeholder content */}
      </div>

      {/* To-Do List Section */}
      <div className="mt-4">
        {todoItems.map((item, index) => (
          <div key={index} className="todo-item">
            <input
              type="checkbox"
              className="w-6 h-6 border-2"
              checked={item.checked}
              onChange={() => toggleStrikethrough(index)} // Toggle strikethrough when clicked
            />
            <span
              className={`${item.checked ? "line-through" : "text-black"}`} // Add strikethrough when checked
              contentEditable
              suppressContentEditableWarning
              
              
              onBlur={(e) => handleTextChange(index, e.currentTarget.innerText)} // Save text when focus is lost
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RichTextEditor;
