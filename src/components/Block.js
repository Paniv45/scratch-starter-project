import React from "react";

export default function Block({ type, label, color, inputs }) {
  const dragStart = (e) => {
    e.dataTransfer.setData("application/my-app", JSON.stringify({ type, label, color, inputs }));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable={true}          // Make this div draggable
      onDragStart={dragStart}   // Attach the dragStart handler
      className={`flex flex-row items-center flex-nowrap text-white px-2 py-2 my-2 text-sm cursor-pointer rounded ${color}`}
    >
      <span className="font-semibold mr-2">{label}</span>

      {inputs.map((input, index) => (
        <div key={index} className="flex flex-row items-center mr-2">
          <input
            type={input.type || "text"}
            defaultValue={input.default}
            placeholder={input.placeholder}
            className="text-black px-1 rounded w-12 mx-1"
          />
          <span className="text-xs">{input.name}</span>
        </div>
      ))}
    </div>
  );
}
